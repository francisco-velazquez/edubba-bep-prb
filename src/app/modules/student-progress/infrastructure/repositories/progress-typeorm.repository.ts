import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProgressRepositoryPort } from '../../application/ports/progress-repository.port';
import { StudentProgressOrmEntity } from '../entities/student-progress-orm.entity';
import { ChapterOrmEntity } from 'src/app/modules/chapters/infrastructure/entities/chapter-orm.entity';
import { StudentSubjectStatusOrmEntity } from '../entities/student-subject-status-orm.entity';

@Injectable()
export class ProgressTypeOrmRepository implements IProgressRepositoryPort {
  constructor(
    @InjectRepository(StudentProgressOrmEntity)
    private readonly progressRepo: Repository<StudentProgressOrmEntity>,
    @InjectRepository(ChapterOrmEntity)
    private readonly chapterRepo: Repository<ChapterOrmEntity>,
    @InjectRepository(StudentSubjectStatusOrmEntity)
    private readonly statusRepo: Repository<StudentSubjectStatusOrmEntity>,
  ) {}

  async markAsCompleted(userId: string, chapterId: number): Promise<void> {
    const progress = this.progressRepo.create({ userId, chapterId });
    await this.progressRepo.upsert(progress, ['userId', 'chapterId']);
  }

  async findCompletedChaptersByUserAndSubject(
    userId: string,
    subjectId: number,
  ): Promise<number[]> {
    const progress = await this.progressRepo
      .createQueryBuilder('progress')
      .innerJoin('progress.chapter', 'chapter')
      .innerJoin('chapter.module', 'module')
      .where('progress.userId = :userId', { userId })
      .andWhere('module.subjectId = :subjectId', { subjectId })
      .getMany();

    return progress.map((p) => p.chapterId);
  }

  async countTotalChaptersInSubject(subjectId: number): Promise<number> {
    return await this.chapterRepo
      .createQueryBuilder('chapter')
      .innerJoin('chapter.module', 'module')
      .where('module.subjectId = :subjectId', { subjectId })
      .getCount();
  }

  async isChapterCompleted(
    userId: string,
    chapterId: number,
  ): Promise<boolean> {
    const count = await this.progressRepo.count({
      where: { userId, chapterId },
    });
    return count > 0;
  }

  async updateSubjectStatus(
    userId: string,
    subjectId: number,
    data: { lastActivityAt: Date; finishedAt: Date | null },
  ): Promise<void> {
    // Usamos upsert para manejar la creación (started_at se pone por default en DB)
    // o la actualización de las fechas.
    await this.statusRepo.upsert(
      {
        userId,
        subjectId,
        lastActivityAt: data.lastActivityAt,
        finishedAt: data.finishedAt,
      },
      ['userId', 'subjectId'], // Llave compuesta para identificar el registro
    );
  }
}
