import { Chapter } from '../../domain/chapter.entity';

export interface IChapterRepositoryPort {
  save(chapter: Partial<Chapter>): Promise<Chapter>;
  findAll(): Promise<Chapter[]>;
  findById(id: number): Promise<Chapter | null>;
  findByModuleId(moduleId: number): Promise<Chapter[]>;
  delete(id: number): Promise<boolean>;
}
