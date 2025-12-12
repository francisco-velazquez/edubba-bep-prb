import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_TEACHER_REPOSITORY } from '../../domain/teacher.entity';
import type { ITeacherRepositoryPort } from '../ports/teacher-repository.port';
import { TeacherResponseDto } from '../dtos/teacher-response.dto';
import { AssignSubjectsDto } from '../dtos/assign-subjects.dto';

@Injectable()
export class AssignSubjectsToTeacherUseCase {
  constructor(
    @Inject(I_TEACHER_REPOSITORY)
    private readonly teacherRepository: ITeacherRepositoryPort,
  ) {}

  async execute(
    userId: string,
    subjectsIds: AssignSubjectsDto,
  ): Promise<TeacherResponseDto> {
    // Verificar existencia
    const teacher = await this.teacherRepository.findById(userId);
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Asignar materias
    const updatedTeacher = await this.teacherRepository.assignSubjects(
      userId,
      subjectsIds,
    );

    return new TeacherResponseDto(updatedTeacher);
  }
}
