import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I_CHAPTER_REPOSITORY } from '../../domain/chapter.entity';
import type { IChapterRepositoryPort } from '../ports/chapter-repository.port';
import { UpdateChapterDto } from '../dtos/update-chapter.dto';
import { ChapterResponseDto } from '../dtos/chapter-response.dto';
import { I_MODULE_REPOSITORY } from 'src/app/modules/modules/domain/module.entity';
import type { IModuleRepositoryPort } from 'src/app/modules/modules/application/ports/module-repository.port';

@Injectable()
export class UpdateChapterUseCase {
  constructor(
    @Inject(I_CHAPTER_REPOSITORY)
    private readonly chapterRepository: IChapterRepositoryPort,
    @Inject(I_MODULE_REPOSITORY)
    private readonly moduleRepository: IModuleRepositoryPort,
  ) {}

  async execute(
    id: number,
    dto: UpdateChapterDto,
  ): Promise<ChapterResponseDto> {
    const existingChapter = await this.chapterRepository.findById(id);

    if (!existingChapter) {
      throw new NotFoundException('Chapter not found');
    }

    // Antes de actualizar el registro, debemos de verificar si existe el módulo al cual se quiere cargar
    const module = await this.moduleRepository.findById(dto.moduleId!);

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const updatedChapter = await this.chapterRepository.save({
      ...existingChapter,
      ...dto,
      updatedAt: new Date(),
    });

    return new ChapterResponseDto(updatedChapter);
  }
}
