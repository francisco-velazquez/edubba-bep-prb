import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_CHAPTER_REPOSITORY } from '../../domain/chapter.entity';
import type { IChapterRepositoryPort } from '../ports/chapter-repository.port';
import { CreateChapterDto } from '../dtos/create-chapter.dto';
import { ChapterResponseDto } from '../dtos/chapter-response.dto';
import { I_MODULE_REPOSITORY } from 'src/app/modules/modules/domain/module.entity';
import type { IModuleRepositoryPort } from 'src/app/modules/modules/application/ports/module-repository.port';

@Injectable()
export class CreateChapterUseCase {
  constructor(
    @Inject(I_CHAPTER_REPOSITORY)
    private readonly chapterRepository: IChapterRepositoryPort,
    @Inject(I_MODULE_REPOSITORY)
    private readonly moduleRepository: IModuleRepositoryPort,
  ) {}

  async execute(dto: CreateChapterDto): Promise<ChapterResponseDto> {
    // Antes de crear el registro, debemos de verificar si existe el módulo al cual se quiere cargar
    const module = await this.moduleRepository.findById(dto.moduleId);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const newChapter = {
      title: dto.title,
      moduleId: dto.moduleId,
      videoUrl: dto.videoUrl || '',
      contentUrl: dto.contentUrl || '',
      orderIndex: dto.orderIndex ?? 0,
      isPublished: dto.isPublished ?? false,
    };

    const saveChapter = await this.chapterRepository.save(newChapter);

    return new ChapterResponseDto(saveChapter);
  }
}
