import { Injectable } from '@nestjs/common';
import { ISubjectRepositoryPort } from '../../application/ports/subject-repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectOrmEntity } from '../entities/subject-orm.entity';
import { Repository } from 'typeorm';
import { Subject } from '../../domain/subject.entity';

@Injectable()
export class SubjectTypeOrmRepository implements ISubjectRepositoryPort {
  constructor(
    @InjectRepository(SubjectOrmEntity)
    private readonly ormRepository: Repository<SubjectOrmEntity>,
  ) {}

  // Mappers
  private toDomain(orm: SubjectOrmEntity): Subject {
    return {
      id: orm.id,
      name: orm.name,
      description: orm.description,
      code: orm.code,
      isActive: orm.isActive,
      gradeId: orm.gradeId,
      grade: orm.grade,
      teachers: orm.teachers,
      modules: orm.modules,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
  }

  // Implementación
  async save(subject: Subject): Promise<Subject> {
    const orm = this.ormRepository.create(subject);
    const saved = await this.ormRepository.save(orm);

    // Recargar para traer la relación 'grade' si es nuevo
    const reloaded = await this.ormRepository.findOne({
      where: { id: saved.id },
      relations: ['grade'],
    });
    console.log(`Reloaded`, reloaded);

    return this.toDomain(reloaded!);
  }

  async findAll(): Promise<Subject[]> {
    const results = await this.ormRepository.find({
      // where: { isActive: true },
      relations: ['grade', 'modules'],
      order: { name: 'ASC' },
    });

    return results.map((result) => this.toDomain(result));
  }

  async findById(id: number): Promise<Subject | null> {
    const result = await this.ormRepository.findOne({
      where: { id },
      relations: ['grade', 'modules', 'modules.chapters'],
      order: {
        modules: {
          orderIndex: 'ASC', // Ordenas los módulos
          chapters: {
            orderIndex: 'ASC', // Ordenas los capítulos dentro del módulo
          },
        },
      },
    });

    return result ? this.toDomain(result) : null;
  }

  async findByGradeId(gradeId: number): Promise<Subject[]> {
    const results = await this.ormRepository.find({
      where: { gradeId },
      relations: ['grade', 'modules'],
      order: { name: 'ASC' },
    });

    return results.map((result) => this.toDomain(result));
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepository.update(id, { isActive: false });

    return result.affected === 1;
  }
}
