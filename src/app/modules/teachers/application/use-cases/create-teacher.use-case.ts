import { Inject, Injectable } from '@nestjs/common';
import { I_TEACHER_REPOSITORY, Teacher } from '../../domain/teacher.entity';
import type { ITeacherRepositoryPort } from '../ports/teacher-repository.port';
import { CreateTeacherDto } from '../dtos/create-teacher.dto';
import { TeacherResponseDto } from '../dtos/teacher-response.dto';

@Injectable()
export class CreateTeacherUseCase {
  constructor(
    @Inject(I_TEACHER_REPOSITORY)
    private readonly teacherRepository: ITeacherRepositoryPort,
  ) {}

  async execute(dto: CreateTeacherDto): Promise<TeacherResponseDto> {
    const newTeacher: Teacher = {
      userId: dto.userId,
      employeeNumber: dto.employeeNumber || '',
      specialty: dto.specialty,
      createdAt: new Date(),
      updatedAt: new Date(),
      subjects: [],
    };

    const saved = await this.teacherRepository.save(newTeacher);

    return new TeacherResponseDto(saved);
  }
}
