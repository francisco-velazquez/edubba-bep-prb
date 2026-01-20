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

    // Obtener el subject status para saber cuando fue el último acceso o cuando se finalizó el curso
    const subjectStatus = await this.progressRepository.getSubjectStatus(
      userId,
      subjectId,
    );

    const result: ProgressResultDto = {
      percentage,
      completedChapters: completedCount,
      totalChapters,
      completedChapterIds: completedIds,
      lastActivityAt: subjectStatus.lastActivityAt,
      finishedAt: subjectStatus.finishedAt,
    };

    return result;
  }
}
