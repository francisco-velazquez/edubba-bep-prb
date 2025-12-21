import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { I_CHAPTER_REPOSITORY } from '../../domain/chapter.entity';
import * as chapterRepositoryPort from '../ports/chapter-repository.port';
import * as storagePort from 'src/shared/storage/application/ports/storage.port';

@Injectable()
export class UploadChapterMediaUseCase {
  constructor(
    @Inject(I_CHAPTER_REPOSITORY)
    private readonly chapterRepository: chapterRepositoryPort.IChapterRepositoryPort,
    @Inject(storagePort.I_STORAGE_PORT)
    private readonly storageProvider: storagePort.IStoragePort,
  ) {}

  async execute(
    chapterId: number,
    file: Express.Multer.File,
    type: 'video' | 'content',
  ) {
    const chapter = await this.chapterRepository.findById(chapterId);
    if (!chapter) throw new NotFoundException('Chapter not found');

    // Definir carpeta según tipo
    const folder = `courses/chapters/${type}s`;
    const fileUrl = await this.storageProvider.upload(file, folder);

    // Borrar archivo antiguo si existe
    const oldUrl = type === 'video' ? chapter.videoUrl : chapter.contentUrl;
    if (oldUrl) await this.storageProvider.delete(oldUrl);

    // Actualizar entidad
    const updateData =
      type === 'video' ? { videoUrl: fileUrl } : { contentUrl: fileUrl };
    return await this.chapterRepository.save({ ...chapter, ...updateData });
  }
}
