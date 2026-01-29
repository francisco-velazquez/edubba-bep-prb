import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_SUBJECT_REPOSITORY } from '../../domain/subject.entity';
import type { ISubjectRepositoryPort } from '../ports/subject-repository.port';
import { SubjectResponseDto } from '../dtos/subject-response.dto';
import { I_TEACHER_REPOSITORY } from 'src/app/modules/teachers/domain/teacher.entity';
import type { ITeacherRepositoryPort } from 'src/app/modules/teachers/application/ports/teacher-repository.port';

@Injectable()
export class FindSubjectByTeacherUseCase {
  constructor(
    @Inject(I_SUBJECT_REPOSITORY)
    private readonly subjectRepository: ISubjectRepositoryPort,
    @Inject(I_TEACHER_REPOSITORY)
    private readonly teacherRepository: ITeacherRepositoryPort,
  ) {}

  async execute(teacherId: string): Promise<SubjectResponseDto[]> {
    // Obtenemos el maestro por su ID y validamos que exista
    const teacher = await this.teacherRepository.findById(teacherId);
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Obtenemos las asignaturas asociadas al maestro
    const subjectIds = teacher.subjects.map((subject) => subject.id);

    const subjectsPromises = subjectIds.map((id) =>
      this.subjectRepository.findById(id),
    );

    // Esperamos a que se resuelvan todas las promesas
    const subjects = await Promise.all(subjectsPromises);

    if (!subjects || subjects.length === 0) {
      return [];
    }

    // Mapeamos cada asignatura a su DTO correspondiente
    const subjectDtos = subjects.map(
      (subject) => new SubjectResponseDto(subject!),
    );

    return subjectDtos;
  }
}
