import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_EXAM_REPOSITORY } from '../../domain/entities/exam.entity';
import type { IExamRepositoryPort } from '../../domain/ports/exam-repository.port';
import { SubmitExamDto } from '../dtos/submit-exam.dto';

@Injectable()
export class SubmitExamUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY) private readonly examRepo: IExamRepositoryPort,
  ) {}

  async execute(userId: string, examId: number, dto: SubmitExamDto) {
    const exam = await this.examRepo.findById(examId);
    if (!exam) throw new NotFoundException('Exam not found');
    if (!exam.questions) throw new NotFoundException('Exam has no questions');

    let correctCount = 0;
    const totalQuestions = exam.questions.length;

    // Calificación comparando con la DB
    exam.questions.forEach((question) => {
      const studentAnswer = dto.answers.find(
        (a) => a.questionId === question.id,
      );
      const correctOption = question.options!.find((o) => o.isCorrect);

      if (
        studentAnswer &&
        correctOption &&
        studentAnswer.optionId === correctOption.id
      ) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / exam.questions.length) * 100);
    const passed = score >= 70;

    await this.examRepo.saveAttempt({
      userId,
      examId,
      score,
      passed,
      completedAt: new Date(),
    });

    return {
      score,
      passed,
      correctAnswers: correctCount,
      totalQuestions,
    };
  }
}
