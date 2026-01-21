import { Exam, ExamAttempt } from '../entities/exam.entity';
import { CreateExamDto } from '../../application/dtos/create-exam.dto';

export interface IExamRepositoryPort {
  createFullExam(data: CreateExamDto): Promise<Exam>;
  findById(id: number): Promise<Exam | null>;
  findByModuleId(moduleId: number): Promise<Exam | null>;
  saveAttempt(attempt: ExamAttempt): Promise<void>;
  findLastAttempt(userId: string, examId: number): Promise<ExamAttempt | null>;
  updateFullExam(examId: number, data: Partial<CreateExamDto>): Promise<Exam>;
  deleteExam(examId: number): Promise<void>;
}
