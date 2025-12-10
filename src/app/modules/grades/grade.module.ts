import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GradeOrmEntity } from "./infrastructure/entities/grade-orm.entity";
import { GradesController } from "./infrastructure/controllers/grades.controller";
import { I_GRADE_REPOSITORY } from "./application/ports/grade-repository.port";
import { GradeTypeOrmRepository } from "./infrastructure/providers/grade-typeorm.repository";
import { CreateGradeUseCase } from "./application/use-case/create-grade.use-case";
import { FindAllGradesUseCase } from "./application/use-case/find-all-grades.use-case";
import { FindGradeByIdUseCase } from "./application/use-case/find-grade-by-id.use-case";
import { UpdateGradeUseCase } from "./application/use-case/update-grade.use-case";
import { DeleteGradeUseCase } from "./application/use-case/delete-grade.use-case";

@Module({
  imports: [
    // Registramos las entidades ORM
    TypeOrmModule.forFeature([GradeOrmEntity]),
  ],
  controllers: [GradesController],
  providers: [
    // Definimos la implementación del port
    {
      provide: I_GRADE_REPOSITORY,
      useClass: GradeTypeOrmRepository,
    },

    // Definimos los casos de uso
    CreateGradeUseCase,
    FindAllGradesUseCase,
    FindGradeByIdUseCase,
    UpdateGradeUseCase,
    DeleteGradeUseCase,

    // Repositorio ORM
    GradeTypeOrmRepository,
  ],
  exports: [
    FindAllGradesUseCase,
  ],
})
export class GradeModule {}