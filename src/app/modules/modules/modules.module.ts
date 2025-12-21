import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleOrmEntity } from './infrastructure/entities/module-orm.entity';
import { AuthModule } from '../auth/auth.module';
import { CreateModuleUseCase } from './application/use-cases/create-module.use-case';
import { FindAllModulesUseCase } from './application/use-cases/find-all-modules.use-case';
import { FindModuleByIdUseCase } from './application/use-cases/find-module-by-id.use-case';
import { UpdateModuleUseCase } from './application/use-cases/update-module.use-case';
import { DeleteModuleUseCase } from './application/use-cases/delete-module.use-case';
import { I_MODULE_REPOSITORY } from './domain/module.entity';
import { ModuleTypeOrmRepository } from './infrastructure/providers/module-typeorm.repository';
import { ModulesController } from './infrastructure/controllers/modules.controller';
import { SubjectsModule } from '../subjects/subjects.module';
import { ChapterOrmEntity } from '../chapters/infrastructure/entities/chapter-orm.entity';
import { ExamOrmEntity } from '../exams/infrastructure/entities/exam-orm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleOrmEntity,
      ChapterOrmEntity,
      ExamOrmEntity,
    ]),
    AuthModule,
    SubjectsModule,
  ],
  controllers: [ModulesController],
  providers: [
    CreateModuleUseCase,
    FindAllModulesUseCase,
    FindModuleByIdUseCase,
    UpdateModuleUseCase,
    DeleteModuleUseCase,
    {
      provide: I_MODULE_REPOSITORY,
      useClass: ModuleTypeOrmRepository,
    },
  ],
  exports: [I_MODULE_REPOSITORY],
})
export class ModulesModule {}
