import { Exam } from '../../domain/exam.entity';

export interface IExamRepositoryPort {
  save(exam: Partial<Exam>): Promise<Exam>;
  findAll(): Promise<Exam[]>;
  findById(id: number): Promise<Exam | null>;
  findByModuleId(moduleId: number): Promise<Exam | null>;
  delete(id: number): Promise<boolean>;
}
