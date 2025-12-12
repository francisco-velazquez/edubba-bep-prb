import { Inject, Injectable } from '@nestjs/common';
import { I_CHAPTER_REPOSITORY } from '../../domain/chapter.entity';
import type { IChapterRepositoryPort } from '../ports/chapter-repository.port';
import { ChapterResponseDto } from '../dtos/chapter-response.dto';

@Injectable()
export class FindChaptersByModuleUseCase {
  constructor(
    @Inject(I_CHAPTER_REPOSITORY)
    private readonly chapterRepositoryh: IChapterRepositoryPort,
  ) {}

  async execute(
    moduleId: number,
    includeUnpublished: boolean,
  ): Promise<ChapterResponseDto[]> {
    let chapters = await this.chapterRepositoryh.findByModuleId(moduleId);

    // Filtramos si no se pide incluir no publicados
    if (!includeUnpublished) {
      chapters = chapters.filter((chapter) => chapter.isPublished);
    }

    return chapters.map((chapter) => new ChapterResponseDto(chapter));
  }
}
