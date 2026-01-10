import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import type { IStudentRepositoryPort } from '../ports/student-repository.port';
import { I_STUDENT_REPOSITORY } from '../ports/student-repository.port';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { StudentResponseDto } from '../dtos/student-response.dto';
import type { IUserRepositoryPort } from '../../../users/domain/ports/user-repository.port';
import { I_USER_REPOSITORY } from '../../../users/domain/ports/user-repository.port';
import type { Student } from '../../domain/student.entity';
import type { User } from '../../../users/domain/entities/user.entity';
import { SUPABASE_CLIENT } from 'src/shared/supabase/supabase.provider';
import { SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateStudentGeneralInfoUseCase {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepositoryPort,
    @Inject(I_USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
    @Inject(SUPABASE_CLIENT)
    private readonly supabaseClient: SupabaseClient,
  ) {}

  async execute(
    userId: string,
    dto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    // 1. Verificar que el estudiante existe
    const student = await this.studentRepository.findById(userId);

    if (!student) {
      throw new NotFoundException(`Student with ID ${userId} not found`);
    }

    // 2. Obtener el usuario completo para validar contraseña si es necesario
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // 3. Si se está actualizando el email, verificar que no esté en uso por otro usuario
    if (dto.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException(
          `El email ${dto.email} ya está registrado por otro usuario.`,
        );
      }
    }

    // 4. Manejar cambio de contraseña si se proporciona
    if (dto.password) {
      const newPassword = dto.password;

      // Validar la contraseña actual
      if (!user.passwordHash) {
        throw new UnauthorizedException(
          'El usuario no tiene una contraseña registrada.',
        );
      }

      // Hashear la nueva contraseña
      const newPasswordHash = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

      // Actualizar contraseña en Supabase Auth
      try {
        // Nota: auth.admin requiere service role key. Si no está disponible, solo actualizamos en BD local
        if (this.supabaseClient.auth.admin) {
          const { error: supabaseError } =
            await this.supabaseClient.auth.admin.updateUserById(userId, {
              password: newPassword,
            });

          if (supabaseError) {
            console.warn(
              `No se pudo actualizar la contraseña en Supabase Auth: ${supabaseError.message}`,
            );
          }
        } else {
          console.warn(
            'Admin client no disponible. La contraseña solo se actualizará en la base de datos local.',
          );
        }
      } catch (error) {
        // Si el admin client no está disponible, continuamos con la actualización local
        console.warn(
          `Error al actualizar contraseña en Supabase Auth: ${(error as Error).message}`,
        );
      }

      // Actualizar el hash de la contraseña en la base de datos
      await this.userRepository.update(userId, {
        passwordHash: newPasswordHash,
      });
    }

    // 5. Preparar datos del estudiante para actualizar
    const studentData: Partial<Student> = {};
    if (dto.enrollmentCode !== undefined) {
      studentData.enrollmentCode = dto.enrollmentCode;
    }
    if (dto.currentGradeId !== undefined) {
      studentData.currentGradeId = dto.currentGradeId;
    }

    // 6. Preparar datos del usuario para actualizar (excluyendo contraseña que ya se manejó)
    const userData: Partial<User> = {};
    if (dto.email !== undefined) {
      userData.email = dto.email;
    }
    if (dto.firstName !== undefined) {
      userData.firstName = dto.firstName;
    }
    if (dto.lastName !== undefined) {
      userData.lastName = dto.lastName;
    }
    if (dto.dateOfBirth !== undefined) {
      userData.dateOfBirth = new Date(dto.dateOfBirth);
    }

    // 7. Actualizar información del estudiante si hay cambios
    if (Object.keys(studentData).length > 0) {
      console.log('studentData', JSON.stringify(studentData, null, 2));
      await this.studentRepository.updateGeneralInfo(userId, studentData);
    }

    // 8. Actualizar información del usuario si hay cambios (excluyendo contraseña)
    if (Object.keys(userData).length > 0) {
      await this.userRepository.update(userId, userData);
    }

    // 9. Obtener el estudiante actualizado con todas las relaciones
    const finalStudent = await this.studentRepository.findById(userId);

    if (!finalStudent) {
      throw new NotFoundException(
        `Failed to retrieve updated student with ID ${userId}`,
      );
    }

    return new StudentResponseDto(finalStudent);
  }
}
