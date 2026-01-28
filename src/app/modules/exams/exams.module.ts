import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ExamOrmEntity,
  OptionOrmEntity,
  QuestionOrmEntity,
} from './infrastructure/entities/exam-orm.entity';
import { AuthModule } from '../auth/auth.module';
import { ModulesModule } from '../modules/modules.module';
import { ExamsController } from './infrastructure/controllers/exams.controller';
import { CreateExamUseCase } from './application/use-cases/create-exam.use-case';
import { FindExamByIdUseCase } from './application/use-cases/find-exam-by-id.use-case';
import { UpdateExamUseCase } from './application/use-cases/update-exam.use-case';
import { DeleteExamUseCase } from './application/use-cases/delete-exam.use-case';
import { I_EXAM_REPOSITORY } from './domain/entities/exam.entity';
import { ExamTypeOrmRepository } from './infrastructure/repositories/exam-typeorm.repository';
import { FindExamByModuleUseCase } from './application/use-cases/find-exam-by-module.use-case';
import { ExamAttemptOrmEntity } from './infrastructure/entities/exam-attempt-orm.entity';
import { SubmitExamUseCase } from './application/use-cases/submit-exam.use-case';
import { GetLastAttemptUseCase } from './application/use-cases/get-last-attempt.use-case';
import { FindExamsBySubjectUseCase } from './application/use-cases/find-exams-by-subject.use-case';
import { FindExamsByTeacherUseCase } from './application/use-cases/find-exam-by-teacher.use-case';
import { TeachersModule } from '../teachers/teachers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExamOrmEntity,
      QuestionOrmEntity,
      OptionOrmEntity,
      ExamAttemptOrmEntity,
    ]),
    AuthModule,
    ModulesModule,
    TeachersModule,
  ],
  controllers: [ExamsController],
  providers: [
    CreateExamUseCase,
    FindExamByModuleUseCase,
    FindExamByIdUseCase,
    UpdateExamUseCase,
    DeleteExamUseCase,
    SubmitExamUseCase,
    GetLastAttemptUseCase,
    FindExamsBySubjectUseCase,
    FindExamsByTeacherUseCase,
    {
      provide: I_EXAM_REPOSITORY,
      useClass: ExamTypeOrmRepository,
    },
  ],
  exports: [I_EXAM_REPOSITORY],
})
export class ExamsModule {}
