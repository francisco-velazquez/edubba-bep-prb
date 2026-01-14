import { SubjectResponseDto } from 'src/app/modules/subjects/application/dtos/subject-response.dto';
import { Module } from '../../domain/module.entity';
import { ChapterResponseDto } from 'src/app/modules/chapters/application/dtos/chapter-response.dto';

export class ModuleResponseDto {
  id: number;
  title: string;
  orderIndex: number;
  isPublished: boolean;
  subjectId: number;

  // Relacion cargada
  subject?: SubjectResponseDto;

  chapters?: ChapterResponseDto[];

  createdAt: Date;
  updatedAt: Date;

  constructor(module: Module) {
    this.id = module.id;
    this.title = module.title;
    this.orderIndex = module.orderIndex;
    this.isPublished = module.isPublished;
    this.subjectId = module.subjectId;
    this.createdAt = module.createdAt;
    this.updatedAt = module.updatedAt;

    if (module.subject) {
      this.subject = new SubjectResponseDto(module.subject);
    }

    if (module.chapters) {
      this.chapters = module.chapters.map(
        (chapter) => new ChapterResponseDto(chapter),
      );
    }
  }
}
