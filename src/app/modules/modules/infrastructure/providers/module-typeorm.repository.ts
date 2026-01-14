import { Injectable } from '@nestjs/common';
import { IModuleRepositoryPort } from '../../application/ports/module-repository.port';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleOrmEntity } from '../entities/module-orm.entity';
import { Repository } from 'typeorm';
import { Module } from '../../domain/module.entity';

@Injectable()
export class ModuleTypeOrmRepository implements IModuleRepositoryPort {
  constructor(
    @InjectRepository(ModuleOrmEntity)
    private readonly ormRepository: Repository<ModuleOrmEntity>,
  ) {}

  // Mappers
  private toDomain(orm: ModuleOrmEntity): Module {
    return {
      id: orm.id,
      title: orm.title,
      orderIndex: orm.orderIndex,
      isPublished: orm.isPublished,
      subjectId: orm.subjectId,
      chapters: orm.chapters,
      subject: orm.subject,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
  }

  // Implementación
  async save(moduleData: Partial<Module>): Promise<Module> {
    const orm = this.ormRepository.create(moduleData);

    const saved = await this.ormRepository.save(orm);

    // Recargamos para obtener la relación subject
    const reloaded = await this.ormRepository.findOne({
      where: { id: saved.id },
      relations: ['subject'],
    });

    return this.toDomain(reloaded!);
  }

  async findAll(): Promise<Module[]> {
    const orms = await this.ormRepository.find({
      relations: ['subject'],
      order: { orderIndex: 'ASC', id: 'ASC' },
    });

    return orms.map((orm) => this.toDomain(orm));
  }

  async findById(id: number): Promise<Module | null> {
    const result = await this.ormRepository.findOne({
      where: { id },
      relations: ['subject', 'chapters'],
    });

    return result ? this.toDomain(result) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepository.delete(id);

    if (result.affected === 1) {
      return true;
    } else {
      return false;
    }
  }
}
