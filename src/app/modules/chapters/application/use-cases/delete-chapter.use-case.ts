import { Inject, Injectable } from '@nestjs/common';
import { I_CHAPTER_REPOSITORY } from '../../domain/chapter.entity';
import type { IChapterRepositoryPort } from '../ports/chapter-repository.port';

@Injectable()
export class DeleteChapterUseCase {
  constructor(
    @Inject(I_CHAPTER_REPOSITORY)
    private readonly chapterRepository: IChapterRepositoryPort,
  ) {}

  async execute(id: number): Promise<boolean> {
    const exists = await this.chapterRepository.findById(id);

    if (!exists) {
      return false;
    }

    await this.chapterRepository.delete(id);

    return true;
  }
}
