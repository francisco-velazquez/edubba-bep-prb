import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IStudentRepositoryPort } from '../ports/student-repository.port';
import { I_STUDENT_REPOSITORY } from '../ports/student-repository.port';
import type { IUserRepositoryPort } from '../../../users/domain/ports/user-repository.port';
import { I_USER_REPOSITORY } from '../../../users/domain/ports/user-repository.port';

@Injectable()
export class DeleteStudentUseCase {
  constructor(
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepositoryPort,
    @Inject(I_USER_REPOSITORY)
    private readonly userRepository: IUserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<boolean> {
    // 1. Verificar que el estudiante existe
    const student = await this.studentRepository.findById(userId);

    if (!student) {
      throw new NotFoundException(`Student with ID ${userId} not found`);
    }

    // 2. Se da de baja al usuario asociado al alumno (lógica)
    await this.userRepository.delete(userId);

    return true;
  }
}
