import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionOrmEntity } from './infrastructure/entities/question-orm.entity';
import { OptionOrmEntity } from './infrastructure/entities/option-orm.entity';
import { QuestionsController } from './infrastructure/controllers/questions.controller';
import { QuestionTypeOrmRepository } from './infrastructure/providers/question-typeorm.repository';
import { I_QUESTION_REPOSITORY } from './domain/question.entity';
import { AuthModule } from '../auth/auth.module';
import { CreateQuestionUseCase } from './application/use-case/create-question.use-case';
import { UpdateQuestionUseCase } from './application/use-case/update-question.use-case';
import { DeleteQuestionUseCase } from './application/use-case/delete-question.use-case';
import { FindQuestionsByExamUseCase } from './application/use-case/find-questions-by-exam.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuestionOrmEntity, OptionOrmEntity]),
    AuthModule,
  ],
  controllers: [QuestionsController],
  providers: [
    CreateQuestionUseCase,
    UpdateQuestionUseCase,
    DeleteQuestionUseCase,
    FindQuestionsByExamUseCase,
    {
      provide: I_QUESTION_REPOSITORY,
      useClass: QuestionTypeOrmRepository,
    },
  ],
  exports: [I_QUESTION_REPOSITORY],
})
export class QuestionsModule {}
