import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './infrastructure/controllers/students.controller';
import { StudentOrmEntity } from './infrastructure/entities/student-orm.entity';
import { I_STUDENT_REPOSITORY } from './application/ports/student-repository.port';
import { StudentTypeOrmRepository } from './infrastructure/providers/student-typeorm.repository';

// Casos de Uso
import { CreateStudentUseCase } from './application/use-cases/create-student.use-case';
import { FindStudentByIdUseCase } from './application/use-cases/find-student-by-id.use-case';
import { UpdateStudentUseCase } from './application/use-cases/update-student.use-case';
import { DeleteStudentUseCase } from './application/use-cases/delete-student.use-case';
import { FindAllStudentsUseCase } from './application/use-cases/find-all-students.use-case';

// Módulos necesarios para inyección o Guardias
import { AuthModule } from '../auth/auth.module'; 
import { UsersModule } from '../users/users.module'; // Para futuras interacciones (ej. crear user y student)
import { GradeModule } from '../grades/grade.module'; // Para la relación (currentGradeId)
import { RegisterStudentUseCase } from './application/use-cases/register-student.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentOrmEntity]),
    AuthModule, // Para JwtAuthGuard y RolesGuard
    UsersModule, // Para interactuar con los datos de usuario
    GradeModule, // Para validar la FK currentGradeId (si lo deseas implementar)
  ],
  controllers: [StudentsController],
  providers: [
    // Repositorio
    {
      provide: I_STUDENT_REPOSITORY,
      useClass: StudentTypeOrmRepository,
    },
    StudentTypeOrmRepository,
    
    // Casos de Uso
    RegisterStudentUseCase,
    CreateStudentUseCase,
    FindAllStudentsUseCase,
    FindStudentByIdUseCase,
    UpdateStudentUseCase,
    DeleteStudentUseCase,
    
    // Aquí se listan otros use cases si los hay...
  ],
  exports: [
    // Exportar Casos de Uso que otros módulos puedan necesitar (ej. buscar un estudiante por ID)
    FindStudentByIdUseCase,
    RegisterStudentUseCase,
    FindAllStudentsUseCase
  ],
})
export class StudentsModule {}