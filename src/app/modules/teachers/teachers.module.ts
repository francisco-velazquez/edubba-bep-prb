import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherOrmEntity } from './infrastructure/entities/teacher-orm.entity';
import { AuthModule } from '../auth/auth.module';
import { TeachersController } from './infrastructure/controllers/teachers.controller';
import { CreateTeacherUseCase } from './application/use-cases/create-teacher.use-case';
import { FindAllTeachersUseCase } from './application/use-cases/find-all-teachers.use-case';
import { FindTeacherByIdUseCase } from './application/use-cases/find-teacher-by-id.use-case';
import { AssignSubjectsToTeacherUseCase } from './application/use-cases/assign-subjects-to-teacher.use-case';
import { I_TEACHER_REPOSITORY } from './domain/teacher.entity';
import { TeacherTypeOrmRepository } from './infrastructure/providers/teacher-typeorm.repository';
import { SubjectOrmEntity } from '../subjects/infrastructure/entities/subject-orm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeacherOrmEntity, SubjectOrmEntity]),
    AuthModule,
  ],
  controllers: [TeachersController],
  providers: [
    CreateTeacherUseCase,
    FindAllTeachersUseCase,
    FindTeacherByIdUseCase,
    AssignSubjectsToTeacherUseCase,
    {
      provide: I_TEACHER_REPOSITORY,
      useClass: TeacherTypeOrmRepository,
    },
  ],
  exports: [I_TEACHER_REPOSITORY],
})
export class TeachersModule {}
