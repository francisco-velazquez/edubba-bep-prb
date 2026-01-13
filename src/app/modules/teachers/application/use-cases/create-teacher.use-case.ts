import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { I_TEACHER_REPOSITORY, Teacher } from '../../domain/teacher.entity';
import type { ITeacherRepositoryPort } from '../ports/teacher-repository.port';
import { CreateTeacherDto } from '../dtos/create-teacher.dto';
import { TeacherResponseDto } from '../dtos/teacher-response.dto';
import { CreateUserUseCase } from '../../../users/application/use-cases/create-user.use-case';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class CreateTeacherUseCase {
  constructor(
    @Inject(I_TEACHER_REPOSITORY)
    private readonly teacherRepository: ITeacherRepositoryPort,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async execute(dto: CreateTeacherDto): Promise<TeacherResponseDto> {
    let userId: string;

    // If userId is not provided, create a user first
    if (!dto.userId || dto.userId.trim() === '') {
      // Validate that required user data is provided
      if (
        !dto.email ||
        !dto.password ||
        !dto.firstName ||
        !dto.lastName ||
        !dto.dateOfBirth ||
        !dto.number_phone
      ) {
        throw new BadRequestException(
          'Si userId no se proporciona, se deben incluir email, password, firstName, lastName y dateOfBirth para crear el usuario.',
        );
      }

      // At this point, TypeScript knows these values exist due to the previous validation
      const userEmail = dto.email;
      const userPassword = dto.password;
      const userFirstName = dto.firstName;
      const userLastName = dto.lastName;
      const userDateOfBirth = dto.dateOfBirth;
      const userNumberPhone = dto.number_phone;

      // Create the user with TEACHER role
      const newUser = await this.createUserUseCase.execute({
        email: userEmail,
        password: userPassword,
        firstName: userFirstName,
        lastName: userLastName,
        role: UserRole.TEACHER,
        dateOfBirth: userDateOfBirth,
        number_phone: userNumberPhone,
      });

      userId = newUser.id;
    } else {
      userId = dto.userId;
    }

    const newTeacher: Teacher = {
      userId: userId,
      employeeNumber: dto.employeeNumber || '',
      specialty: dto.specialty,
      createdAt: new Date(),
      updatedAt: new Date(),
      subjects: [],
    };

    const saved = await this.teacherRepository.save(newTeacher);

    return new TeacherResponseDto(saved);
  }
}
