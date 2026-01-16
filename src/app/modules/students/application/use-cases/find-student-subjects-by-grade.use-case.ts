import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_STUDENT_REPOSITORY } from '../ports/student-repository.port';
import type { IStudentRepositoryPort } from '../ports/student-repository.port';
import { I_SUBJECT_REPOSITORY } from 'src/app/modules/subjects/domain/subject.entity';
import { StudentSubjectByGradeResponseDto } from '../dtos/student-subject-by-grade-response.dto';
import type { ISubjectRepositoryPort } from 'src/app/modules/subjects/application/ports/subject-repository.port';
import { SubjectResponseDto } from 'src/app/modules/subjects/application/dtos/subject-response.dto';

@Injectable()
export class StudentSubjectByGradeUseCase {
  constructor(
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepositoryPort,
    @Inject(I_SUBJECT_REPOSITORY)
    private readonly subjectRepository: ISubjectRepositoryPort,
  ) {}

  async execute(studentId: string): Promise<StudentSubjectByGradeResponseDto> {
    const student = await this.studentRepository.findById(studentId);

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found.`);
    }

    const subjects = await this.subjectRepository.findByGradeId(
      student.currentGradeId,
    );

    const studentSubjects = new StudentSubjectByGradeResponseDto(
      student.userId,
      subjects.map((subject) => new SubjectResponseDto(subject)),
    );

    return studentSubjects;
  }
}
