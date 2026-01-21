import { Inject, Injectable } from '@nestjs/common';
import {
  ExamAttempt,
  I_EXAM_REPOSITORY,
} from '../../domain/entities/exam.entity';
import type { IExamRepositoryPort } from '../../domain/ports/exam-repository.port';

@Injectable()
export class GetLastAttemptUseCase {
  constructor(
    @Inject(I_EXAM_REPOSITORY)
    private readonly examRepository: IExamRepositoryPort,
  ) {}

  async execute(userId: string, examId: number): Promise<ExamAttempt | null> {
    return await this.examRepository.findLastAttempt(userId, examId);
  }
}
