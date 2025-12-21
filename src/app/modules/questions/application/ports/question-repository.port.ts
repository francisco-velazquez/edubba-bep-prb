import { Question } from '../../domain/question.entity';

export interface IQuestionRepositoryPort {
  save(question: Partial<Question>): Promise<Question>;
  findByExamId(examId: number): Promise<Question[]>;
  findById(id: number): Promise<Question | null>;
  delete(id: number): Promise<boolean>;
}
