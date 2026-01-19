import { Inject, Injectable } from '@nestjs/common';
import type { IProgressRepositoryPort } from '../ports/progress-repository.port';
import { CalculateSubjectProgressUseCase } from './calculate-subject-progress.use-case';

@Injectable()
export class ToggleChapterCompletionUseCase {
  constructor(
    @Inject('IProgressRepositoryPort')
    private readonly progressRepository: IProgressRepositoryPort,
    private readonly calculateProgress: CalculateSubjectProgressUseCase,
  ) {}

  async execute(
    userId: string,
    chapterId: number,
    subjectId: number,
  ): Promise<void> {
    await this.progressRepository.markAsCompleted(userId, chapterId);

    const progress = await this.calculateProgress.execute(userId, subjectId);

    const isFinished = progress.percentage === 100;

    await this.progressRepository.updateSubjectStatus(userId, subjectId, {
      lastActivityAt: new Date(),
      finishedAt: isFinished ? new Date() : null,
    });
  }
}
