import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IStudentRepositoryPort } from '../ports/student-repository.port';
import { I_STUDENT_REPOSITORY } from '../ports/student-repository.port';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { Student, StudentId } from '../../domain/student.entity';
import { FindStudentByIdUseCase } from './find-student-by-id.use-case';
import { IsInt, IsNotEmpty } from 'class-validator';
import { StudentResponseDto } from '../dtos/student-response.dto';

export class UpdateStudentGradeDto {
  @IsInt()
  @IsNotEmpty()
  newGradeId: number;
}

@Injectable()
export class UpdateStudentUseCase {
  constructor(
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepositoryPort,
  ) {}

  async execute(userId: string, dto: UpdateStudentGradeDto): Promise<StudentResponseDto> {
    const student = await this.studentRepository.findById(userId);

    if(!student) {
      throw new NotFoundException(`Student with ID ${userId} not found`);
    }

    const updatedStudent = await this.studentRepository.updateGrade(userId, dto.newGradeId);
    
    return new StudentResponseDto(updatedStudent);
  }
}