import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class UpdateStudentDto {
  @ApiProperty({ example: 'Matricula del alumno', required: false })
  @IsString()
  @IsOptional()
  enrollmentCode?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  currentGradeId?: number;

  @ApiProperty({ example: 'estudiante@ejemplo.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Juan', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Pérez', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: '2000-01-15', required: false })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario (mínimo 6 caracteres)',
    required: false,
    example: 'newPassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;
}
