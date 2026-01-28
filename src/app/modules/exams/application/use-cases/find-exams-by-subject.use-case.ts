import { Injectable, Inject } from '@nestjs/common';
import {
  I_EXAM_REPOSITORY,
  StudentExam,
  StudentOption,
  StudentQuestion,
} from '../../domain/entities/exam.entity';
import type { IExamRepositoryPort } from '../../domain/ports/exam-repository.port';
import { ExamResponseDto } from '../dtos/exam-response.dto';

@Injectable()
export class FindExamsBySubjectUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
  ) {}

  async execute(subjectId: number, role: string): Promise<ExamResponseDto[]> {
    const exams = await this.examRepository.findBySubjectId(subjectId);

    // Mapeamos cada examen a su DTO correspondiente
    return exams.map((exam) => {
      const hasQuestions = exam.questions && exam.questions.length > 0;

      if (role === 'STUDENT' && !hasQuestions) {
        const sanitizedQuestions: StudentQuestion[] = exam.questions!.map(
          (q): StudentQuestion => {
            const studentOptions: StudentOption[] = q.options!.map(
              ({ isCorrect: _, ...rest }) => rest,
            );

            return {
              ...q,
              options: studentOptions,
            };
          },
        );

        const studentExam: StudentExam = {
          ...exam,
          questions: sanitizedQuestions,
        };

        return new ExamResponseDto(studentExam);
      }

      return new ExamResponseDto(exam);
    });
  }
}
