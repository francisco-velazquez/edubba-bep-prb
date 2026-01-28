import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectOrmEntity } from './infrastructure/entities/subject-orm.entity';
import { TeacherOrmEntity } from '../teachers/infrastructure/entities/teacher-orm.entity';
import { AuthModule } from '../auth/auth.module';
import { SubjectsController } from './infrastructure/controllers/subjects.controller';
import { CreateSubjectUseCase } from './application/use-cases/create-subject.use-case';
import { FindAllSubjectsUseCase } from './application/use-cases/find-all-subjects.use-case';
import { FindSubjectByIdUseCase } from './application/use-cases/find-subject-by-id.use-case';
import { UpdateSubjectUseCase } from './application/use-cases/update-subject.use-case';
import { DeleteSubjectUseCase } from './application/use-cases/delete-subject.use-case';
import { I_SUBJECT_REPOSITORY } from './domain/subject.entity';
import { SubjectTypeOrmRepository } from './infrastructure/providers/subject-typeorm.repository';
import { ModuleOrmEntity } from '../modules/infrastructure/entities/module-orm.entity';
import { TeachersModule } from '../teachers/teachers.module';
import { FindSubjectByTeacherUseCase } from './application/use-cases/find-subject-by-teacher.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubjectOrmEntity,
      TeacherOrmEntity,
      ModuleOrmEntity,
    ]),
    AuthModule,
    TeachersModule,
  ],
  controllers: [SubjectsController],
  providers: [
    CreateSubjectUseCase,
    FindAllSubjectsUseCase,
    FindSubjectByIdUseCase,
    UpdateSubjectUseCase,
    DeleteSubjectUseCase,
    FindSubjectByTeacherUseCase,
    {
      provide: I_SUBJECT_REPOSITORY,
      useClass: SubjectTypeOrmRepository,
    },
  ],
  exports: [I_SUBJECT_REPOSITORY, FindAllSubjectsUseCase],
})
export class SubjectsModule {}
