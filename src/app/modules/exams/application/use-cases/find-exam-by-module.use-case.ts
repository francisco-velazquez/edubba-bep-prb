import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  Exam,
  I_EXAM_REPOSITORY,
  StudentExam,
  StudentQuestion,
} from '../../domain/entities/exam.entity';
import type { IExamRepositoryPort } from '../../domain/ports/exam-repository.port';
import { ExamResponseDto } from '../dtos/exam-response.dto';

@Injectable()
export class FindExamByModuleUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
  ) {}

  async execute(moduleId: number, role: string): Promise<ExamResponseDto> {
    const exam: Exam | null =
      await this.examRepository.findByModuleId(moduleId);

    if (!exam) {
      throw new NotFoundException(`Exam for module Id ${moduleId} not found`);
    }

    if (!exam.questions || exam.questions.length === 0) {
      throw new NotFoundException(
        'This exam is not ready yet (no questions found)',
      );
    }

    if (role === 'STUDENT') {
      const sanitizedQuestions: StudentQuestion[] = exam.questions.map((q) => ({
        ...q,
        options: q.options!.map(({ isCorrect: _isCorrect, ...rest }) => rest),
      }));

      const studentExam: StudentExam = {
        ...exam,
        questions: sanitizedQuestions,
      };

      return new ExamResponseDto(studentExam);
    }

    return new ExamResponseDto(exam);
  }
}
