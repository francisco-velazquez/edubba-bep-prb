import { Subject } from '../../domain/subject.entity';

export interface ISubjectRepositoryPort {
  save(
    subject: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'> | Subject,
  ): Promise<Subject>;
  findAll(): Promise<Subject[]>;
  findById(id: number): Promise<Subject | null>;
  findByGradeId(gradeId: number): Promise<Subject[]>;
  delete(id: number): Promise<boolean>;
}
