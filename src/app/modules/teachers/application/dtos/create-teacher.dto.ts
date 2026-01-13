import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEmail,
  MinLength,
  IsDateString,
  ValidateIf,
} from 'class-validator';
import { CreateUserDto } from '../../../users/application/dtos/create-user.dto';

export class CreateTeacherDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description:
      'ID heredado de la cuenta de usuario previamente creada (opcional si se proporcionan datos de usuario)',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ValidateIf((o: CreateTeacherDto) => !o.email)
  @IsUUID()
  @IsNotEmpty()
  userId?: string;

  // User fields with conditional validation
  @ApiProperty({
    description:
      'Correo electrónico del usuario (requerido si userId no se proporciona)',
    required: false,
    example: 'teacher@example.com',
  })
  @ValidateIf((o: CreateTeacherDto) => !o.userId)
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    description:
      'Contraseña del usuario (requerida si userId no se proporciona, mínimo 6 caracteres)',
    required: false,
    example: 'password123',
  })
  @ValidateIf((o: CreateTeacherDto) => !o.userId)
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    description: 'Nombre del usuario (requerido si userId no se proporciona)',
    required: false,
    example: 'Juan',
  })
  @ValidateIf((o: CreateTeacherDto) => !o.userId)
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({
    description: 'Apellido del usuario (requerido si userId no se proporciona)',
    required: false,
    example: 'Pérez',
  })
  @ValidateIf((o: CreateTeacherDto) => !o.userId)
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({
    description:
      'Fecha de nacimiento del usuario (requerida si userId no se proporciona, formato ISO 8601)',
    required: false,
    example: '2005-05-15',
  })
  @ValidateIf((o: CreateTeacherDto) => !o.userId)
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth?: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsOptional()
  employeeNumber?: string;

  @ApiProperty({ example: 'Matemáticas' })
  @IsString()
  @IsOptional()
  specialty?: string;
}
