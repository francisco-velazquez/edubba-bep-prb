import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { I_CHAPTER_REPOSITORY } from '../../domain/chapter.entity';
import * as chapterRepositoryPort from '../ports/chapter-repository.port';
import * as storagePort from 'src/shared/storage/application/ports/storage.port';

@Injectable()
export class GetChapterUploadConfigUseCase {
  constructor(
    @Inject(I_CHAPTER_REPOSITORY)
    private readonly chapterRepository: chapterRepositoryPort.IChapterRepositoryPort,
    @Inject(storagePort.I_STORAGE_PORT)
    private readonly storageProvider: storagePort.IStoragePort,
  ) {}

  async execute(
    chapterId: number,
    fileName: string,
    contentType: string,
    type: 'video' | 'content',
  ) {
    console.log(fileName, contentType);
    const chapter = await this.chapterRepository.findById(chapterId);
    if (!chapter) throw new NotFoundException('Chapter not found');

    const folder = `courses/chapters/${type}s`;

    // Generamos la URL firmada
    const { uploadUrl, fileUrl } = await this.storageProvider.generateUploadUrl(
      fileName,
      folder,
      contentType,
    );

    // OPCIONAL: Podrías guardar la fileUrl en la DB de una vez como "pendiente"
    // o esperar a que el frontend confirme que la subida fue exitosa.
    // Por ahora, solo retornamos la config para el frontend.

    return {
      uploadUrl,
      fileUrl,
      chapterId,
    };
  }
}
