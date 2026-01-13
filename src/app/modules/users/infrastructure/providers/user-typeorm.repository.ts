import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUserRepositoryPort } from '../../domain/ports/user-repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/use-orm.entity';
import { User } from '../../domain/entities/user.entity';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

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
    orm.firstName = user.firstName;
    orm.lastName = user.lastName;
    orm.passwordHash = user.passwordHash;
    orm.isActive = user.isActive;
    orm.dateOfBirth = user.dateOfBirth!;
    orm.number_phone = user.number_phone;
    orm.createdAt = user.createdAt;
    orm.updatedAt = user.updatedAt;
    return orm;
  }

  // Función de mapeo (ORM Entity -> Domain Entity)
  private toDomainEntity(
    ormUser: UserOrmEntity,
    role: string,
    passwordHash?: string,
  ): User {
    return {
      ...ormUser,
      firstName: ormUser.firstName,
      lastName: ormUser.lastName,
      passwordHash: passwordHash || '',
      role: role as User['role'], // Mapeamos el string del rol a nuestro Enum
      isActive: ormUser.isActive,
      dateOfBirth: ormUser.dateOfBirth,
      number_phone: ormUser.number_phone,
      createdAt: ormUser.createdAt,
      updatedAt: ormUser.updatedAt,
    };
  }

  // =======================================================================
  // INTERFACE IMPLEMENTATION
  // =======================================================================

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'isActive'> & {
      passwordHash: string;
    },
  ): Promise<User> {
    const newUserId = uuidv4();
    const now = new Date();

    const newUser: User = {
      id: newUserId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      passwordHash: data.passwordHash,
      role: data.role,
      dateOfBirth: data.dateOfBirth,
      number_phone: data.number_phone,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const ormUser = this.toOrmEntity(newUser);

    // Usamos una transacción para garantizar que profiles y user_roles se creen juntos
    return this.dataSource.transaction(async (manager) => {
      // 1. Guardar la entidad en profiles
      const savedProfile = await manager.save(UserOrmEntity, ormUser);

      // 2. Insertar el rol
      await manager.query(
        'INSERT INTO public.user_roles (user_id, role) VALUES ($1, $2)',
        [newUserId, data.role!],
      );

      // Devolvemos la entidad del dominio
      // toDomainEntity necesita el ORM y el rol para el mapeo completo
      return this.toDomainEntity(savedProfile, data.role!);
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const ormUser = await this.profilesRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'isActive',
        'dateOfBirth',
        'number_phone',
        'passwordHash',
        'createdAt',
        'updatedAt',
      ] as (keyof UserOrmEntity)[],
    });

    if (!ormUser) {
      return null;
    }

    const role = await this.getRole(ormUser.id);

    // Mapeo (Mapper) de ORM Entity a Domain Entity
    const domainUser: User = {
      ...ormUser,
      firstName: ormUser.firstName,
      lastName: ormUser.lastName,
      role: role as User['role'],
      isActive: ormUser.isActive,
      dateOfBirth: ormUser.dateOfBirth,
    };

    return domainUser;
  }

  async findById(id: string): Promise<User | null> {
    const ormUser = await this.profilesRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'isActive',
        'dateOfBirth',
        'number_phone',
        'passwordHash',
        'createdAt',
        'updatedAt',
      ] as (keyof UserOrmEntity)[],
    });

    if (!ormUser) {
      return null;
    }

    const role = await this.getRole(ormUser.id);

    // Mapeo (Mapper) de ORM Entity a Domain Entity
    const domainUser: User = {
      ...ormUser,
      firstName: ormUser.firstName,
      lastName: ormUser.lastName,
      role: role as User['role'],
      isActive: ormUser.isActive,
      dateOfBirth: ormUser.dateOfBirth,
      number_phone: ormUser.number_phone,
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
          firstName: ormUser.firstName,
          lastName: ormUser.lastName,
          role: role as User['role'],
          isActive: ormUser.isActive,
          dateOfBirth: ormUser.dateOfBirth,
          number_phone: ormUser.number_phone,
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
          firstName: ormUser.firstName,
          lastName: ormUser.lastName,
          role: role as User['role'],
          isActive: ormUser.isActive,
          dateOfBirth: ormUser.dateOfBirth,
          number_phone: ormUser.number_phone,
        };

        return domainUser;
      }),
    );

    return mappedResult.then((promises) => Promise.all(promises));
  }

  async save(user: User): Promise<User> {
    // ⚠️ Validación: El ID debe existir para guardar/actualizar
    if (!user.id) {
      throw new InternalServerErrorException(
        'Cannot save user without an existing ID.',
      );
    }

    const ormUser = this.toOrmEntity(user);
    ormUser.updatedAt = new Date(); // Actualizamos el timestamp

    // Usamos una transacción para garantizar que profiles y user_roles se actualicen juntos
    return this.dataSource.transaction(async (manager) => {
      // Guardamos o actualizamos la entidad en profiles
      const saveProfile = await manager.save(UserOrmEntity, ormUser);

      // Manejamos el rol
      const currentRole = await this.getRole(user.id);

      if (!currentRole) {
        // Si el rol no existe, lo insertamos
        await manager.query(
          'INSERT INTO public.user_roles (user_id, role) VALUES ($1, $2)',
          [user.id, user.role],
        );
      } else if (currentRole !== (user.role as string)) {
        // Si el rol existe y es diferente se actualiza
        await manager.query(
          'UPDATE public.user_roles SET role = $1 WHERE user_id = $2',
          [user.role, user.id],
        );
      }

      // Devolvemos la entidad del dominio con los datos actualizados
      return this.toDomainEntity(saveProfile, user.role!);
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
      const currentRole = await this.getRole(userToUpdate.id);

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
