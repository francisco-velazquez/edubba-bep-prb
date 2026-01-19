import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_STUDENT_REPOSITORY } from '../ports/student-repository.port';
import type { IStudentRepositoryPort } from '../ports/student-repository.port';
import { I_SUBJECT_REPOSITORY } from 'src/app/modules/subjects/domain/subject.entity';
import { StudentSubjectByGradeResponseDto } from '../dtos/student-subject-by-grade-response.dto';
import type { ISubjectRepositoryPort } from 'src/app/modules/subjects/application/ports/subject-repository.port';
import { SubjectResponseDto } from 'src/app/modules/subjects/application/dtos/subject-response.dto';
import { GradeResponseDto } from 'src/app/modules/grades/application/dtos/grade-response.dto';
import { CalculateSubjectProgressUseCase } from 'src/app/modules/student-progress/application/use-cases/calculate-subject-progress.use-case';

@Injectable()
export class StudentSubjectByGradeUseCase {
  constructor(
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepositoryPort,
    @Inject(I_SUBJECT_REPOSITORY)
    private readonly subjectRepository: ISubjectRepositoryPort,
    private readonly calculateProgress: CalculateSubjectProgressUseCase,
  ) {}

  async execute(studentId: string): Promise<StudentSubjectByGradeResponseDto> {
    const student = await this.studentRepository.findById(studentId);

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    const subjects = await this.subjectRepository.findByGradeId(
      student.currentGradeId,
    );

    // Creamos el arreglo de promesas para obtener el progreso por cada asignatura
    const subjectPromises = subjects.map(async (subject) => {
      const progress = await this.calculateProgress.execute(
        studentId,
        subject.id,
      );

      const subjectMap = new SubjectResponseDto(subject);
      subjectMap.setProgress(progress);

      return subjectMap;
    });

    // Esperamos que se resuelvan todas las promesas anteriores
    const subjectsWithProgress = await Promise.all(subjectPromises);

    // Asignamos el resultado al dto de respuesta
    const studentSubjects = new StudentSubjectByGradeResponseDto(
      student.userId,
      new GradeResponseDto(student.currentGrade!),
      subjectsWithProgress,
    );

    return studentSubjects;
  }
}
