import { SubjectResponseDto } from 'src/app/modules/subjects/application/dtos/subject-response.dto';
import { Module } from '../../domain/module.entity';

export class ModuleResponseDto {
  id: number;
  title: string;
  orderIndex: number;
  isPublished: boolean;
  subjectId: number;

  // Relacion cargada
  subject?: SubjectResponseDto;

  constructor(module: Module) {
    this.id = module.id;
    this.title = module.title;
    this.orderIndex = module.orderIndex;
    this.isPublished = module.isPublished;
    this.subjectId = module.subjectId;

    if (module.subject) {
      this.subject = new SubjectResponseDto(module.subject);
    }
  }
}
