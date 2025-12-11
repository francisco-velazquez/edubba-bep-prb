import { Injectable } from '@nestjs/common';
import { RegisterStudentDto } from '../dtos/register-student.dto';
import { Student } from '../../domain/student.type';
import { CreateStudentUseCase } from './create-student.use-case';
import { UserRole } from 'src/common/enums/user-role.enum';
// 🔑 Importación asumida de UsersModule (debe estar exportado)
import { CreateUserUseCase } from '../../../users/application/use-cases/create-user.use-case'; 
import { FindUserByEmailUseCase } from 'src/app/modules/users/application/use-cases/find-user-by-email.use-case';

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase, 
    private readonly createStudentUseCase: CreateStudentUseCase, 
    // 🔑 NOTA: Aquí se podría inyectar un servicio de Transacciones si se requiere
  ) {}

  /**
   * 🔑 Patrón Fachada (Facade): Crea la cuenta de usuario y el perfil de estudiante
   * de forma coordinada.
   */
  async execute(dto: RegisterStudentDto): Promise<Student> {
    
    // 1. Crear la cuenta de usuario (UsersModule)
    const user = await this.findUserByEmailUseCase.execute(dto.email);
    
    // 2. Crear el perfil de estudiante (StudentsModule)
    // Se usa el ID de la cuenta de usuario como ID del perfil de estudiante
    const studentProfile = await this.createStudentUseCase.execute({
      userId: user?.id!, // 🔑 Enlace 1:1 entre User y Student
      enrollmentCode: dto.enrollmentCode,
      fullName: dto.fullName,
      currentGradeId: dto.currentGradeId,
    });

    return studentProfile;
  }
}