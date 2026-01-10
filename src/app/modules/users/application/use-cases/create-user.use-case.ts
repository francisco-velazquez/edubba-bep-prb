import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { I_USER_REPOSITORY } from '../../domain/ports/user-repository.port';
import type { IUserRepositoryPort } from '../../domain/ports/user-repository.port';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
  ) {}

  /**
   * Crea una nueva cuenta de usuario en el sistema.
   * Valida la unicidad del email y hashea la contraseña.
   * @param dto Los datos de creación del usuario.
   * @returns La entidad User creada.
   */
  async execute(dto: CreateUserDto): Promise<User> {
    // 1. Verificar unicidad del email
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException(`El email ${dto.email} ya está registrado.`);
    }

    // 2. Hashear la contraseña
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // 3. Crear el usuario en el repositorio
    const newUser = await this.userRepository.create({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      passwordHash: passwordHash,
      dateOfBirth: new Date(dto.dateOfBirth),
      // isActive, createdAt, updatedAt son manejados por la entidad/repositorio
    });

    return newUser;
  }
}
