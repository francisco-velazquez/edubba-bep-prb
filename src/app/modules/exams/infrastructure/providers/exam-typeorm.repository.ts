import { Injectable } from '@nestjs/common';
import { IExamRepositoryPort } from '../../application/ports/exam-repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamOrmEntity } from '../entities/exam-orm.entity';
import { Repository } from 'typeorm';
import { Exam } from '../../domain/exam.entity';

@Injectable()
export class ExamTypeOrmRepository implements IExamRepositoryPort {
  constructor(
    @InjectRepository(ExamOrmEntity)
    private readonly ormRepository: Repository<ExamOrmEntity>,
  ) {}

  // Mappers
  private toDomain(orm: ExamOrmEntity): Exam {
    return {
      id: orm.id,
      title: orm.title,
      moduleId: orm.moduleId,
      module: orm.module,
    };
  }

  // Implementación
  async save(examData: Partial<Exam>): Promise<Exam> {
    const orm = this.ormRepository.create(examData);
    const saved = await this.ormRepository.save(orm);

    const reloaded = await this.ormRepository.findOne({
      where: { id: saved.id },
      relations: ['module'],
    });

    return this.toDomain(reloaded!);
  }

  async findAll(): Promise<Exam[]> {
    const orms = await this.ormRepository.find({
      relations: ['module'],
      order: { id: 'ASC' },
    });

    return orms.map((orm) => this.toDomain(orm));
  }

  async findById(id: number): Promise<Exam | null> {
    const result = await this.ormRepository.findOne({
      where: { id },
      relations: ['module'],
    });

    return result ? this.toDomain(result) : null;
  }

  async findByModuleId(moduleId: number): Promise<Exam | null> {
    const result = await this.ormRepository.findOne({
      where: { moduleId },
      relations: ['module'],
    });

    return result ? this.toDomain(result) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepository.delete(id);

    if (result.affected !== 1) return false;

    return true;
  }
}
