import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamOrmEntity } from './infrastructure/entities/exam-orm.entity';
import { AuthModule } from '../auth/auth.module';
import { ModulesModule } from '../modules/modules.module';
import { ExamsController } from './infrastructure/controllers/exams.controller';
import { CreateExamUseCase } from './application/use-cases/create-exam.use-case';
import { FindExamByModuleUseCase } from './application/use-cases/find-exam-by-module.use-case';
import { FindAllExamsUseCase } from './application/use-cases/fin-all-exams.use-case';
import { FindExamByIdUseCase } from './application/use-cases/find-exam-by-id.use-case';
import { UpdateExamUseCase } from './application/use-cases/update-exam.use-case';
import { DeleteExamUseCase } from './application/use-cases/delete-exam.use-case';
import { I_EXAM_REPOSITORY } from './domain/exam.entity';
import { ExamTypeOrmRepository } from './infrastructure/providers/exam-typeorm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamOrmEntity]),
    AuthModule,
    ModulesModule,
  ],
  controllers: [ExamsController],
  providers: [
    CreateExamUseCase,
    FindExamByModuleUseCase,
    FindAllExamsUseCase,
    FindExamByIdUseCase,
    UpdateExamUseCase,
    DeleteExamUseCase,
    {
      provide: I_EXAM_REPOSITORY,
      useClass: ExamTypeOrmRepository,
    },
  ],
  exports: [I_EXAM_REPOSITORY],
})
export class ExamsModule {}
