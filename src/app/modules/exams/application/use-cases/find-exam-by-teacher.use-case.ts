import { Injectable, Inject } from '@nestjs/common';
import { I_EXAM_REPOSITORY } from '../../domain/entities/exam.entity';
import type { IExamRepositoryPort } from '../../domain/ports/exam-repository.port';
import { ExamResponseDto } from '../dtos/exam-response.dto';
import { I_TEACHER_REPOSITORY } from 'src/app/modules/teachers/domain/teacher.entity';
import type { ITeacherRepositoryPort } from 'src/app/modules/teachers/application/ports/teacher-repository.port';

@Injectable()
export class FindExamsByTeacherUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
    @Inject(I_TEACHER_REPOSITORY)
    private readonly teacherRepository: ITeacherRepositoryPort,
  ) {}

  async execute(teacherId: string): Promise<ExamResponseDto[]> {
    console.log('Finding exams for teacher ID:', teacherId);
    // Obtenemos el maestro por su ID y validamos que exista
    const teacher = await this.teacherRepository.findById(teacherId);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    // Obtenemos las asignaturas asociadas al maestro
    const subjects = teacher.subjects;

    if (!subjects || subjects.length === 0) {
      return [];
    }

    // Obtenemos los exámenes asociados a las asignaturas del maestro
    const subjectIds = subjects.map((subject) => subject.id);

    // Recuperamos los exámenes por los IDs de las asignaturas

    const exams = subjectIds.map(async (subjectId) => {
      return this.examRepository.findBySubjectId(subjectId);
    });

    // Aplanamos el arreglo de exámenes
    const examsFlattened = (await Promise.all(exams)).flat();

    // Mapeamos cada examen a su DTO correspondiente
    return examsFlattened.map((exam) => new ExamResponseDto(exam));
  }
}
