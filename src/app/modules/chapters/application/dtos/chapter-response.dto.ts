import { ModuleResponseDto } from 'src/app/modules/modules/application/dtos/module-response.dto';
import { Chapter } from '../../domain/chapter.entity';

export class ChapterResponseDto {
  id: number;
  title: string;
  description?: string;
  videoUrl: string | null;
  contentUrl: string | null;
  orderIndex: number;
  isPublished: boolean;
  moduleId: number;

  // Relación
  module?: ModuleResponseDto;

  constructor(chapter: Chapter) {
    this.id = chapter.id;
    this.title = chapter.title;
    this.description = chapter.description || '';
    this.videoUrl = chapter.videoUrl || null;
    this.contentUrl = chapter.contentUrl || null;
    this.orderIndex = chapter.orderIndex;
    this.isPublished = chapter.isPublished;
    this.moduleId = chapter.moduleId;

    // Relación
    if (chapter.module) {
      this.module = new ModuleResponseDto(chapter.module);
    }
  }
}
