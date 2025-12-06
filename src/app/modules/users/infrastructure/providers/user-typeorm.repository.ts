import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUserRepositoryPort } from '../../domain/ports/user-repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/use-orm.entity';
import { User } from '../../domain/entities/user.entity';
import { DataSource } from 'typeorm/browser';

interface RoleQueryResult {
  role: string;
}

@Injectable()
export class UserTypeOrmRepository implements IUserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly profilesRepository: Repository<UserOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // =======================================================================
  // UTILITIES (Métodos de apoyo para gestionar el rol en user_roles)
  // =======================================================================

  private async getRole(userId: string): Promise<string | null> {
    // Aquí usamos una consulta raw, ya que el rol está en una tabla separada (user_roles)
    // Supabase lo hace así por seguridad
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const result = (await this.profilesRepository.query(
      'SELECT role FROM public.user_roles WHERE user_id = $1 LIMIT 1',
      [userId],
    )) as RoleQueryResult[];

    if (result.length > 0) {
      return result[0].role;
    }

    return null;
  }

  // Función de mapeo (Domain Entity -> ORM Entity)
  private toOrmEntity(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.email = user.email;
    orm.fullName = user.fullName;
    orm.isActive = user.isActive;
    orm.currentGradeId = user.currentGradeId!;
    return orm;
  }

  // Función de mapeo (ORM Entity -> Domain Entity)
  private toDomainEntity(ormUser: UserOrmEntity, role: string): User {
    return {
      ...ormUser,
      fullName: ormUser.fullName,
      role: role as User['role'], // Mapeamos el string del rol a nuestro Enum
    };
  }

  // =======================================================================
  // INTERFACE IMPLEMENTATION
  // =======================================================================

  async findByEmail(email: string): Promise<User | null> {
    const ormUser = await this.profilesRepository.findOne({
      where: { email },
    });

    if (!ormUser) {
      return null;
    }

    const role = await this.getRole(ormUser.id);

    // Mapeo (Mapper) de ORM Entity a Domain Entity
    const domainUser: User = {
      ...ormUser,
      fullName: ormUser.fullName,
      role: role as User['role'],
    };

    return domainUser;
  }

  async findById(id: string): Promise<User | null> {
    const ormUser = await this.profilesRepository.findOne({
      where: { id },
    });

    if (!ormUser) {
      return null;
    }

    const role = await this.getRole(ormUser.id);

    // Mapeo (Mapper) de ORM Entity a Domain Entity
    const domainUser: User = {
      ...ormUser,
      fullName: ormUser.fullName,
      role: role as User['role'],
    };

    return domainUser;
  }

  async findAll(): Promise<User[]> {
    const result = this.profilesRepository.find();

    const mappedResult = result.then((ormUsers) =>
      ormUsers.map(async (ormUser) => {
        const role = await this.getRole(ormUser.id);

        // Mapeo (Mapper) de ORM Entity a Domain Entity
        const domainUser: User = {
          ...ormUser,
          fullName: ormUser.fullName,
          role: role as User['role'],
        };

        return domainUser;
      }),
    );

    return mappedResult.then((promises) => Promise.all(promises));
  }

  async findAllActive(): Promise<User[]> {
    const result = this.profilesRepository.find({ where: { isActive: true } });

    const mappedResult = result.then((ormUsers) =>
      ormUsers.map(async (ormUser) => {
        const role = await this.getRole(ormUser.id);

        // Mapeo (Mapper) de ORM Entity a Domain Entity
        const domainUser: User = {
          ...ormUser,
          fullName: ormUser.fullName,
          role: role as User['role'],
        };

        return domainUser;
      }),
    );

    return mappedResult.then((promises) => Promise.all(promises));
  }

  async save(user: User): Promise<User> {
    const ormUser = this.toOrmEntity(user);

    // Usamos una transacción para garantizar que profiles y user_roles se actualicen juntos
    return this.dataSource.transaction(async (manager) => {
      // Guaramos o actualizamos la entidad en profiles
      const saveProfile = await manager.save(UserOrmEntity, ormUser);

      // Manejamos el rol
      const currentRole = await this.getRole(user.id);

      if (currentRole && currentRole !== (user.role as string)) {
        // Si el rol existe y es diferente se actualiza
        await manager.query(
          'UPDATE public.user_roles SET role = $1 WHERE user_id = $2',
          [user.role, user.id],
        );
      } else if (!currentRole) {
        // Si no existe, se inserta
        await manager.query(
          'INSERT INTO public.user_roles (user_id, role) VALUES ($1, $2)',
          [user.id, user.role],
        );
      }

      // Devolvemos la entidad del dominiio con los datos actualizados
      return this.toDomainEntity(saveProfile, user.role);
    });
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const userToUpdate = await this.profilesRepository.findOne({
      where: { id },
    });

    if (!userToUpdate) {
      throw new InternalServerErrorException('User not found');
    }

    const updatedUser = { ...userToUpdate, ...user };
    const ormUser = this.toOrmEntity(updatedUser as User);

    // Usamos una transacción para garantizar que profiles y user_roles se actualicen juntos
    return this.dataSource.transaction(async (manager) => {
      // Guaramos o actualizamos la entidad en profiles
      const saveProfile = await manager.save(UserOrmEntity, ormUser);

      // Manejamos el rol
      const currentRole = await this.getRole(user.id!);

      if (currentRole && currentRole !== (user.role as string)) {
        // Si el rol existe y es diferente se actualiza
        await manager.query(
          'UPDATE public.user_roles SET role = $1 WHERE user_id = $2',
          [user.role, user.id],
        );
      } else if (!currentRole) {
        // Si no existe, se inserta
        await manager.query(
          'INSERT INTO public.user_roles (user_id, role) VALUES ($1, $2)',
          [user.id, user.role],
        );
      }

      // Devolvemos la entidad del dominiio con los datos actualizados
      return this.toDomainEntity(saveProfile, user.role!);
    });
  }

  // Cambiamos el estatus del usuario a inactivo
  async delete(id: string): Promise<void> {
    await this.profilesRepository.update(id, { isActive: false });
  }
}
