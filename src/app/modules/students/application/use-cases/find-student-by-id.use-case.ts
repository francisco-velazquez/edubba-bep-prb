import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IStudentRepositoryPort } from '../ports/student-repository.port';
import { I_STUDENT_REPOSITORY } from '../ports/student-repository.port';
import { StudentResponseDto } from '../dtos/student-response.dto';

@Injectable()
export class FindStudentByIdUseCase {
  constructor(
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepositoryPort,
  ) {}

  async execute(userId: string): Promise<StudentResponseDto> {
    const student = await this.studentRepository.findById(userId);

    if (!student) {
      throw new NotFoundException(`Student with ID ${userId} not found.`);
    }

    return new StudentResponseDto(student);
  }
}
