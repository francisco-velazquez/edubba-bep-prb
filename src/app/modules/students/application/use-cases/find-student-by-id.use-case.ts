import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as studentRepositoryPort from '../ports/student-repository.port';
import { Student, StudentId } from '../../domain/student.type';

@Injectable()
export class FindStudentByIdUseCase {
  constructor(
    @Inject(studentRepositoryPort.I_STUDENT_REPOSITORY)
    private readonly studentRepository: studentRepositoryPort.IStudentRepository,
  ) {}

  async execute(id: StudentId): Promise<Student> {
    const student = await this.studentRepository.findById(id);

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found.`);
    }

    return student;
  }
}