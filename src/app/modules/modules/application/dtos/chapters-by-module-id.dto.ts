import { ChapterResponseDto } from 'src/app/modules/chapters/application/dtos/chapter-response.dto';

export class ChaptersByModuleResponseDto {
  moduleId: number;
  chapters: ChapterResponseDto[] | undefined;

  constructor(moduleId: number, chapters: ChapterResponseDto[] | undefined) {
    this.moduleId = moduleId;
    this.chapters = chapters;
  }
}
