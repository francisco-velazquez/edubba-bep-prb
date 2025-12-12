import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_TEACHER_REPOSITORY } from '../../domain/teacher.entity';
import type { ITeacherRepositoryPort } from '../ports/teacher-repository.port';
import { TeacherResponseDto } from '../dtos/teacher-response.dto';

@Injectable()
export class FindTeacherByIdUseCase {
  constructor(
    @Inject(I_TEACHER_REPOSITORY)
    private readonly teacherRepository: ITeacherRepositoryPort,
  ) {}

  async execute(userId: string): Promise<TeacherResponseDto> {
    const teacher = await this.teacherRepository.findById(userId);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return new TeacherResponseDto(teacher);
  }
}
