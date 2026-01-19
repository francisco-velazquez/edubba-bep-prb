import { Inject, Injectable } from '@nestjs/common';
import { I_MODULE_REPOSITORY } from '../../domain/module.entity';
import type { IModuleRepositoryPort } from '../ports/module-repository.port';
import { ChaptersByModuleResponseDto } from '../dtos/chapters-by-module-id.dto';
import { ChapterResponseDto } from 'src/app/modules/chapters/application/dtos/chapter-response.dto';

@Injectable()
export class FindChaptersByModuleIdUseCase {
  constructor(
    @Inject(I_MODULE_REPOSITORY)
    private readonly moduleRepository: IModuleRepositoryPort,
  ) {}

  async execute(id: number): Promise<ChaptersByModuleResponseDto> {
    // Validamos si existe el modulo
    const module = await this.moduleRepository.findById(id);

    if (!module) {
      throw new Error('Module not found');
    }

    // Buscamos los capitulos que tiene un módulo
    const chapters = module.chapters
      ?.sort((a, b) => a.orderIndex - b.orderIndex)
      .map((chapter) => new ChapterResponseDto(chapter));

    return new ChaptersByModuleResponseDto(id, chapters);
  }
}
