import { Injectable, Inject } from '@nestjs/common';
import * as studentRepositoryPort from '../ports/student-repository.port';
import { StudentId } from '../../domain/student.type';
import { FindStudentByIdUseCase } from './find-student-by-id.use-case';

@Injectable()
export class DeleteStudentUseCase {
  constructor(
    @Inject(studentRepositoryPort.I_STUDENT_REPOSITORY)
    private readonly studentRepository: studentRepositoryPort.IStudentRepository,
    private readonly findStudentByIdUseCase: FindStudentByIdUseCase,
  ) {}

  async execute(id: StudentId): Promise<void> {
    // Verifica existencia
    await this.findStudentByIdUseCase.execute(id);

    await this.studentRepository.softDelete(id);
  }
}