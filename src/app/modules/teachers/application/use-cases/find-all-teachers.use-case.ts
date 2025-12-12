import { Inject, Injectable } from '@nestjs/common';
import { I_TEACHER_REPOSITORY } from '../../domain/teacher.entity';
import type { ITeacherRepositoryPort } from '../ports/teacher-repository.port';
import { TeacherResponseDto } from '../dtos/teacher-response.dto';

@Injectable()
export class FindAllTeachersUseCase {
  constructor(
    @Inject(I_TEACHER_REPOSITORY)
    private readonly teacherRepository: ITeacherRepositoryPort,
  ) {}

  async execute(): Promise<TeacherResponseDto[]> {
    const teachers = await this.teacherRepository.findAll();

    return teachers.map((teacher) => new TeacherResponseDto(teacher));
  }
}
