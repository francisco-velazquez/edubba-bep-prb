import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  I_USER_REPOSITORY,
  type IUserRepositoryPort,
} from 'src/app/modules/users/domain/ports/user-repository.port';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dtos/register.dto';
import { UserResponseDto } from 'src/app/modules/users/application/dtos/user-response.dto';
import { User } from 'src/app/modules/users/domain/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { SUPABASE_CLIENT } from 'src/shared/supabase/supabase.provider';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(I_USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
    @Inject(SUPABASE_CLIENT)
    private readonly supabaseClient: SupabaseClient,
  ) {}

  async execute(dto: RegisterDto): Promise<UserResponseDto> {
    // Verificamos si el usuario ya existe
    const existUser = await this.userRepository.findByEmail(dto.email);
    if (existUser) {
      throw new ConflictException('The email has been register before');
    }

    // 2. 🔑 REGISTRAR EN SUPABASE AUTH PRIMERO
    const { data, error } = await this.supabaseClient.auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      // Manejar el error de Supabase (ej. contraseña débil, email ya registrado)
      throw new Error(`Supabase Auth Error: ${error.message}`);
    }

    const supabaseUserId = data.user!.id;

    // Hasheamos la contraseña (usando un factor de seguridad alto)
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Creamos la entidad de usuario (se genera un nuevo UUID en el repositorio)
    const newUser: User = {
      id: supabaseUserId, // El repositorio se encargará de generar un UUID o usar el de Supabase Auth
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash: passwordHash,
      role: UserRole.STUDENT,
      isActive: true,
      dateOfBirth: new Date(dto.dateOfBirth),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Guardamos en la base de datos (profiles + user_role)
    const savedUser = await this.userRepository.save(newUser);

    //Devolvemos el dto como respuesta
    return new UserResponseDto(savedUser);
  }
}
