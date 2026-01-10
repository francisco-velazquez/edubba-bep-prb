import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IStudentRepositoryPort } from '../ports/student-repository.port';
import { I_STUDENT_REPOSITORY } from '../ports/student-repository.port';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { Student } from '../../domain/student.entity';
import { StudentResponseDto } from '../dtos/student-response.dto';
import { CreateUserUseCase } from '../../../users/application/use-cases/create-user.use-case';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject(I_STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepositoryPort,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async execute(dto: CreateStudentDto): Promise<StudentResponseDto> {
    // TODO: Validar que el numero de matricula no se duplique.

    let userId: string;

    // Si userId está vacío, crear un usuario primero
    if (!dto.userId || dto.userId.trim() === '') {
      // Validar que se proporcionen los datos necesarios para crear el usuario
      if (
        !dto.email ||
        !dto.password ||
        !dto.firstName ||
        !dto.lastName ||
        !dto.dateOfBirth
      ) {
        throw new BadRequestException(
          'Si userId no se proporciona, se deben incluir email, password, firstName, lastName y dateOfBirth para crear el usuario.',
        );
      }

      // En este punto, TypeScript sabe que estos valores existen debido a la validación anterior
      const userEmail = dto.email;
      const userPassword = dto.password;
      const userFirstName = dto.firstName;
      const userLastName = dto.lastName;
      const userDateOfBirth = dto.dateOfBirth;

      // Crear el usuario con rol STUDENT
      const newUser = await this.createUserUseCase.execute({
        email: userEmail,
        password: userPassword,
        firstName: userFirstName,
        lastName: userLastName,
        role: UserRole.STUDENT,
        dateOfBirth: userDateOfBirth,
      });

      userId = newUser.id;
    } else {
      userId = dto.userId;
    }

    const newStudent: Student = {
      userId: userId,
      enrollmentCode: dto.enrollmentCode,
      currentGradeId: dto.currentGradeId || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedStudent = await this.studentRepository.save(newStudent);

    return new StudentResponseDto(savedStudent);
  }
}
