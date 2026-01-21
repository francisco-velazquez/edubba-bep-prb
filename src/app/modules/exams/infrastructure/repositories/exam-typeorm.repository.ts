import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamOrmEntity } from '../entities/exam-orm.entity';
import { CreateExamDto } from '../../application/dtos/create-exam.dto';
import { IExamRepositoryPort } from '../../domain/ports/exam-repository.port';
import { Exam, ExamAttempt } from '../../domain/entities/exam.entity';
import { ExamAttemptOrmEntity } from '../entities/exam-attempt-orm.entity';

@Injectable()
export class ExamTypeOrmRepository implements IExamRepositoryPort {
  constructor(
    @InjectRepository(ExamOrmEntity)
    private readonly examRepo: Repository<ExamOrmEntity>,
    @InjectRepository(ExamAttemptOrmEntity)
    private readonly attemptRepo: Repository<ExamAttemptOrmEntity>,
  ) {}

  async createFullExam(data: CreateExamDto): Promise<Exam> {
    const newExam = this.examRepo.create(data);
    const savedExam = await this.examRepo.save(newExam);
    return savedExam as unknown as Exam;
  }

  async findById(id: number): Promise<Exam | null> {
    const exam = await this.examRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });
    return exam as Exam | null;
  }

  async findByModuleId(moduleId: number): Promise<Exam | null> {
    const exam = await this.examRepo.findOne({
      where: { moduleId },
      relations: ['questions', 'questions.options'],
    });
    return exam as Exam | null;
  }

  async findLastAttempt(
    userId: string,
    examId: number,
  ): Promise<ExamAttempt | null> {
    const attempt = await this.attemptRepo.findOne({
      where: { userId, examId },
      order: { completedAt: 'DESC' },
    });
    return attempt as ExamAttempt | null;
  }

  async saveAttempt(attempt: ExamAttempt): Promise<void> {
    const newAttempt = this.attemptRepo.create({
      userId: attempt.userId,
      examId: attempt.examId,
      score: attempt.score,
      passed: attempt.passed,
      completedAt: attempt.completedAt,
    });

    await this.attemptRepo.save(newAttempt);
  }

  async updateFullExam(
    examId: number,
    data: Partial<CreateExamDto>,
  ): Promise<Exam> {
    const exam = await this.examRepo.findOne({
      where: { id: examId },
      relations: ['questions', 'questions.options'],
    });

    if (!exam) throw new NotFoundException('Exam not found to update');

    // Fusionamos los datos.
    // Nota: TypeORM merge aplica los cambios del DTO sobre la entidad cargada.
    const updatedExam = this.examRepo.merge(exam, {
      title: data.title,
      questions: data.questions?.map((q) => ({
        ...q,
        options: q.options.map((o) => ({ ...o })),
      })),
    });

    const saved = await this.examRepo.save(updatedExam);
    return saved as unknown as Exam;
  }

  async deleteExam(examId: number): Promise<void> {
    // Debido a que configuramos cascade: true y las FK en DB,
    // al eliminar el examen se eliminan preguntas y opciones automáticamente.
    await this.examRepo.delete(examId);
  }
}
