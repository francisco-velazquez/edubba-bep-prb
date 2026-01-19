import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IChapterRepositoryPort } from '../../application/ports/chapter-repository.port';
import { ChapterOrmEntity } from '../entities/chapter-orm.entity';
import { Chapter } from '../../domain/chapter.entity';

@Injectable()
export class ChapterTypeOrmRepository implements IChapterRepositoryPort {
  constructor(
    @InjectRepository(ChapterOrmEntity)
    private readonly chapterRepository: Repository<ChapterOrmEntity>,
  ) {}

  // Mappers
  private toDomain(orm: ChapterOrmEntity): Chapter {
    return {
      id: orm.id,
      title: orm.title,
      description: orm.description,
      videoUrl: orm.videoUrl,
      contentUrl: orm.contentUrl,
      orderIndex: orm.orderIndex,
      isPublished: orm.isPublished,
      moduleId: orm.moduleId,
      module: orm.module,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
  }

  // Implementación
  async save(chapterData: Partial<Chapter>): Promise<Chapter> {
    const orm = this.chapterRepository.create(chapterData);
    const saved = await this.chapterRepository.save(orm);

    // Recargamos para obtener la relación con modules
    const reloaded = await this.chapterRepository.findOne({
      where: { id: saved.id },
      relations: ['module'],
    });

    return this.toDomain(reloaded!);
  }

  async findAll(): Promise<Chapter[]> {
    const chapters = await this.chapterRepository.find({
      relations: ['module'],
      order: { orderIndex: 'ASC', id: 'ASC' },
    });

    return chapters.map((chapter) => this.toDomain(chapter));
  }

  async findById(id: number): Promise<Chapter | null> {
    const result = await this.chapterRepository.findOne({
      where: { id },
      relations: ['module'],
    });

    return result ? this.toDomain(result) : null;
  }

  async findByModuleId(moduleId: number): Promise<Chapter[]> {
    const reuslt = await this.chapterRepository.find({
      where: { moduleId },
      relations: ['module'],
      order: { orderIndex: 'ASC', id: 'ASC' },
    });

    return reuslt.map((chapter) => this.toDomain(chapter));
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.chapterRepository.delete(id);

    if (result.affected === 1) {
      return true;
    } else {
      return false;
    }
  }
}
