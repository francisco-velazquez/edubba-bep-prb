import { Injectable, Inject } from '@nestjs/common';
import type { IStudentRepositoryPort } from '../ports/student-repository.port';
import { I_STUDENT_REPOSITORY } from '../ports/student-repository.port';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { Student } from '../../domain/student.entity';
import { StudentResponseDto } from '../dtos/student-response.dto';

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepositoryPort,
  ) {}

  async execute(dto: CreateStudentDto): Promise<StudentResponseDto> {
    // TODO: Validar que el numero de matricula no se duplique.

    const newStudent: Student = {
      userId: dto.userId,
      enrollmentCode: dto.enrollmentCode,
      currentGradeId: dto.currentGradeId || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedStudent = await this.studentRepository.save(newStudent);

    return new StudentResponseDto(savedStudent);
  }
}
