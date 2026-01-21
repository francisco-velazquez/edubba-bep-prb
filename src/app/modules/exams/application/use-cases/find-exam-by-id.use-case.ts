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
export class FindExamByIdUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
  ) {}

  async execute(id: number, role: string): Promise<ExamResponseDto> {
    const exam: Exam | null = await this.examRepository.findById(id);

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    if (!exam.questions || exam.questions.length === 0) {
      throw new NotFoundException('Exam has no questions');
    }

    if (role === 'STUDENT') {
      // Aplicamos la transformación segura para el alumno
      const sanitizedQuestions: StudentQuestion[] = exam.questions.map(
        (question) => ({
          ...question,
          options: question.options!.map(
            ({ isCorrect: _isCorrect, ...rest }) => rest,
          ),
        }),
      );

      const studentExam: StudentExam = {
        ...exam,
        questions: sanitizedQuestions,
      };

      return new ExamResponseDto(studentExam);
    }

    // Para TEACHER o ADMIN devolvemos el examen completo
    return new ExamResponseDto(exam);
  }
}
