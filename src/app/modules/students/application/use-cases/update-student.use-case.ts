import { Injectable, Inject } from '@nestjs/common';
import * as studentRepositoryPort from '../ports/student-repository.port';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { Student, StudentId } from '../../domain/student.type';
import { FindStudentByIdUseCase } from './find-student-by-id.use-case';

@Injectable()
export class UpdateStudentUseCase {
  constructor(
    @Inject(studentRepositoryPort.I_STUDENT_REPOSITORY)
    private readonly studentRepository: studentRepositoryPort.IStudentRepository,
    private readonly findStudentByIdUseCase: FindStudentByIdUseCase,
  ) {}

  async execute(id: StudentId, dto: UpdateStudentDto): Promise<Student> {
    const existingStudent = await this.findStudentByIdUseCase.execute(id);

    const updatedStudent: Partial<Student> = {
      ...existingStudent,
      // Aplicar las propiedades del DTO (incluyendo la conversión de fecha si existe)
      ...dto,
      id: id,
      updatedAt: new Date(),
    };
    
    return this.studentRepository.save(updatedStudent);
  }
}