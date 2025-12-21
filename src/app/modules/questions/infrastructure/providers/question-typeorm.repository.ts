import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionOrmEntity } from '../entities/question-orm.entity';
import { IQuestionRepositoryPort } from '../../application/ports/question-repository.port';
import { Question } from '../../domain/question.entity';

@Injectable()
export class QuestionTypeOrmRepository implements IQuestionRepositoryPort {
  constructor(
    @InjectRepository(QuestionOrmEntity)
    private readonly questionRepository: Repository<QuestionOrmEntity>,
  ) {}

  // Mappers
  private toDomain(orm: QuestionOrmEntity): Question {
    return {
      id: orm.id,
      examId: orm.examId,
      questionText: orm.questionText,
      questionType: orm.questionType,
      options:
        orm.options?.map((opt) => ({
          id: opt.id,
          questionId: opt.questionId,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
        })) || [],
    };
  }

  // Implementación
  async save(questionData: Partial<Question>): Promise<Question> {
    // .save en TypeORM hace un upsert (crea si no hay ID, actualiza si hay ID)
    // El cascade: true en la entidad manejará las opciones automáticamente
    const orm = this.questionRepository.create(questionData);
    const saved = await this.questionRepository.save(orm);

    // Recargamos para obtener las opciones actualizadas
    const reloaded = await this.questionRepository.findOne({
      where: { id: saved.id },
      relations: ['options'],
    });

    return this.toDomain(reloaded!);
  }

  async findByExamId(examId: number): Promise<Question[]> {
    const questions = await this.questionRepository.find({
      where: { examId },
      relations: ['options'],
    });

    return questions.map((q) => this.toDomain(q));
  }

  async findById(id: number): Promise<Question | null> {
    const result = await this.questionRepository.findOne({
      where: { id },
      relations: ['options'],
    });

    return result ? this.toDomain(result) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.questionRepository.delete(id);
    return result.affected === 1;
  }
}
