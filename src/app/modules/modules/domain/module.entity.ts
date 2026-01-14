import { Chapter } from '../../chapters/domain/chapter.entity';
import { Subject } from '../../subjects/domain/subject.entity';

export interface Module {
  id: number;
  title: string;
  orderIndex: number;
  isPublished: boolean;

  // Relación N:1 con asignatura (Subject)
  subjectId: number;
  subject?: Subject;

  // Relación 1:N con Capitulos (chapters)
  chapters?: Chapter[];

  createdAt: Date;
  updatedAt: Date;
}

export const I_MODULE_REPOSITORY = 'IModuleRepository';
