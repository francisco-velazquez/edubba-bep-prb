import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_CHAPTER_REPOSITORY } from '../../domain/chapter.entity';
import type { IChapterRepositoryPort } from '../ports/chapter-repository.port';
import { ChapterResponseDto } from '../dtos/chapter-response.dto';

@Injectable()
export class FindChapterByIdUseCase {
  constructor(
    @Inject(I_CHAPTER_REPOSITORY)
    private readonly chapterRepository: IChapterRepositoryPort,
  ) {}

  async execute(id: number): Promise<ChapterResponseDto> {
    const chapter = await this.chapterRepository.findById(id);

    if (!chapter) {
      throw new NotFoundException('Chapter not found');
    }

    return new ChapterResponseDto(chapter);
  }
}
