import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IProgressRepositoryPort } from '../ports/progress-repository.port';
import { CalculateSubjectProgressUseCase } from './calculate-subject-progress.use-case';
import type { IChapterRepositoryPort } from 'src/app/modules/chapters/application/ports/chapter-repository.port';
import { I_CHAPTER_REPOSITORY } from 'src/app/modules/chapters/domain/chapter.entity';

@Injectable()
export class ToggleChapterCompletionUseCase {
  constructor(
    @Inject('IProgressRepositoryPort')
    private readonly progressRepository: IProgressRepositoryPort,
    private readonly calculateProgress: CalculateSubjectProgressUseCase,
    @Inject(I_CHAPTER_REPOSITORY)
    private readonly chapterRepository: IChapterRepositoryPort,
  ) {}

  async execute(userId: string, chapterId: number): Promise<void> {
    await this.progressRepository.markAsCompleted(userId, chapterId);

    // Obtenemos a que asignatura pertenece el capitulo
    const chapter = await this.chapterRepository.findById(chapterId);

    if (!chapter) throw new NotFoundException('Chapter not found');
    if (!chapter.module) throw new NotFoundException('Module not found');
    if (!chapter.module.subjectId)
      throw new NotFoundException('Subject not found');

    // Obtenemos el progreso
    const subjectId = chapter.module.subjectId;

    const progress = await this.calculateProgress.execute(userId, subjectId);

    const isFinished = progress.percentage === 100;

    await this.progressRepository.updateSubjectStatus(userId, subjectId, {
      lastActivityAt: new Date(),
      finishedAt: isFinished ? new Date() : null,
    });
  }
}
