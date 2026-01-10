import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { I_USER_REPOSITORY } from '../../domain/ports/user-repository.port';
import type { IUserRepositoryPort } from '../../domain/ports/user-repository.port';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../../domain/entities/user.entity';
import { SUPABASE_CLIENT } from 'src/shared/supabase/supabase.provider';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class CreateUserUseCase {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
    @Inject(SUPABASE_CLIENT)
    private readonly supabaseClient: SupabaseClient,
  ) {}

  /**
   * Crea una nueva cuenta de usuario en el sistema.
   * Primero registra en Supabase Auth, luego crea el perfil en la base de datos.
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

    // 2. 🔑 REGISTRAR EN SUPABASE AUTH PRIMERO
    const { data, error } = await this.supabaseClient.auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      // Manejar el error de Supabase (ej. contraseña débil, email ya registrado)
      throw new ConflictException(
        `Error al registrar en Supabase Auth: ${error.message}`,
      );
    }

    if (!data.user) {
      throw new ConflictException('Error al crear usuario en Supabase Auth');
    }

    const supabaseUserId = data.user.id;

    // 3. Hashear la contraseña (usando un factor de seguridad alto)
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // 4. Crear la entidad de usuario con el ID de Supabase Auth
    const newUser: User = {
      id: supabaseUserId, // Usar el ID de Supabase Auth
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash: passwordHash,
      role: dto.role,
      isActive: true,
      dateOfBirth: new Date(dto.dateOfBirth),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 5. Guardar en la base de datos (profiles + user_role) usando save en lugar de create
    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }
}
