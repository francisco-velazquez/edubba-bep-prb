import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProgressOrmEntity } from './infrastructure/entities/student-progress-orm.entity';
import { ChapterOrmEntity } from '../chapters/infrastructure/entities/chapter-orm.entity';
import { CalculateSubjectProgressUseCase } from './application/use-cases/calculate-subject-progress.use-case';
import { ToggleChapterCompletionUseCase } from './application/use-cases/toggle-chapter-completion.use-case';
import { ProgressController } from './infrastructure/controllers/progress.controller';
import { ProgressTypeOrmRepository } from './infrastructure/repositories/progress-typeorm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentProgressOrmEntity, ChapterOrmEntity]),
  ],
  controllers: [ProgressController],
  providers: [
    {
      provide: 'IProgressRepositoryPort',
      useClass: ProgressTypeOrmRepository,
    },
    CalculateSubjectProgressUseCase,
    ToggleChapterCompletionUseCase,
  ],
  exports: [CalculateSubjectProgressUseCase], // Lo exportamos por si el SubjectUseCase lo necesita
})
export class ProgressModule {}
