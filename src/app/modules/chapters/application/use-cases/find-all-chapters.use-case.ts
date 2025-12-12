import { Inject, Injectable } from '@nestjs/common';
import { I_CHAPTER_REPOSITORY } from '../../domain/chapter.entity';
import type { IChapterRepositoryPort } from '../ports/chapter-repository.port';
import { ChapterResponseDto } from '../dtos/chapter-response.dto';

@Injectable()
export class FindAllChaptersUseCase {
  constructor(
    @Inject(I_CHAPTER_REPOSITORY)
    private readonly chapterRepository: IChapterRepositoryPort,
  ) {}

  async execute(): Promise<ChapterResponseDto[]> {
    const chapters = await this.chapterRepository.findAll();

    return chapters.map((chapter) => new ChapterResponseDto(chapter));
  }
}
