import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type { IStudentRepositoryPort } from '../ports/student-repository.port';
import { I_STUDENT_REPOSITORY } from '../ports/student-repository.port';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { StudentResponseDto } from '../dtos/student-response.dto';
import type { IUserRepositoryPort } from '../../../users/domain/ports/user-repository.port';
import { I_USER_REPOSITORY } from '../../../users/domain/ports/user-repository.port';
import type { Student } from '../../domain/student.entity';
import type { User } from '../../../users/domain/entities/user.entity';

@Injectable()
export class UpdateStudentGeneralInfoUseCase {
  constructor(
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepositoryPort,
    @Inject(I_USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
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

    // 2. Si se está actualizando el email, verificar que no esté en uso por otro usuario
    if (dto.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException(
          `El email ${dto.email} ya está registrado por otro usuario.`,
        );
      }
    }

    // 3. Preparar datos del estudiante para actualizar
    const studentData: Partial<Student> = {};
    if (dto.enrollmentCode !== undefined) {
      studentData.enrollmentCode = dto.enrollmentCode;
    }
    if (dto.currentGradeId !== undefined) {
      studentData.currentGradeId = dto.currentGradeId;
    }

    // 4. Preparar datos del usuario para actualizar
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

    // 5. Actualizar información del estudiante si hay cambios
    if (Object.keys(studentData).length > 0) {
      console.log('studentData', JSON.stringify(studentData, null, 2));
      await this.studentRepository.updateGeneralInfo(userId, studentData);
    }

    // 6. Actualizar información del usuario si hay cambios
    if (Object.keys(userData).length > 0) {
      await this.userRepository.update(userId, userData);
    }

    // 7. Obtener el estudiante actualizado con todas las relaciones
    const finalStudent = await this.studentRepository.findById(userId);

    if (!finalStudent) {
      throw new NotFoundException(
        `Failed to retrieve updated student with ID ${userId}`,
      );
    }

    return new StudentResponseDto(finalStudent);
  }
}
