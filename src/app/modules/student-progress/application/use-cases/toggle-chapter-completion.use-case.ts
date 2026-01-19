import { Inject, Injectable } from '@nestjs/common';
import type { IProgressRepositoryPort } from '../ports/progress-repository.port';

@Injectable()
export class ToggleChapterCompletionUseCase {
  constructor(
    @Inject('IProgressRepositoryPort')
    private readonly progressRepository: IProgressRepositoryPort,
  ) {}

  async execute(userId: string, chapterId: number): Promise<void> {
    await this.progressRepository.markAsCompleted(userId, chapterId);
  }
}
