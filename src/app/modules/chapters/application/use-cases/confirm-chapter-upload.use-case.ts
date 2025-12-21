import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { I_CHAPTER_REPOSITORY } from '../../domain/chapter.entity';
import * as chapterRepositoryPort from '../ports/chapter-repository.port';

@Injectable()
export class ConfirmChapterUploadUseCase {
  constructor(
    @Inject(I_CHAPTER_REPOSITORY)
    private readonly chapterRepository: chapterRepositoryPort.IChapterRepositoryPort,
  ) {}

  async execute(chapterId: number, fileUrl: string, type: 'video' | 'content') {
    const chapter = await this.chapterRepository.findById(chapterId);
    if (!chapter) throw new NotFoundException('Chapter not found');

    // Actualizamos solo el campo correspondiente
    const updateData =
      type === 'video' ? { videoUrl: fileUrl } : { contentUrl: fileUrl };

    return await this.chapterRepository.save({
      ...chapter,
      ...updateData,
    });
  }
}
