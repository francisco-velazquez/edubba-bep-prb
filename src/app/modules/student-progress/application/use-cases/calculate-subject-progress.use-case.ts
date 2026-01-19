import { Inject, Injectable } from '@nestjs/common';
import type { IProgressRepositoryPort } from '../ports/progress-repository.port';
import { ProgressResultDto } from '../dtos/calculate-progress-result.dto';

@Injectable()
export class CalculateSubjectProgressUseCase {
  constructor(
    @Inject('IProgressRepositoryPort')
    private readonly progressRepository: IProgressRepositoryPort,
  ) {}

  async execute(userId: string, subjectId: number): Promise<ProgressResultDto> {
    const [totalChapters, completedIds] = await Promise.all([
      this.progressRepository.countTotalChaptersInSubject(subjectId),
      this.progressRepository.findCompletedChaptersByUserAndSubject(
        userId,
        subjectId,
      ),
    ]);

    const completedCount = completedIds.length;
    const percentage =
      totalChapters > 0
        ? Math.round((completedCount / totalChapters) * 100)
        : 0;

    const result: ProgressResultDto = {
      percentage,
      completedChapters: completedCount,
      totalChapters,
    };

    return result;
  }
}
