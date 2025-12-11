import { IsEmail, IsNotEmpty, IsString, MinLength, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 🔑 Combina campos de User y Student
export class RegisterStudentDto {
  // --- Campos de la cuenta de usuario ---
  @ApiProperty({ 
    description: 'Correo electrónico único para la cuenta de usuario',
    example: 'student@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'Contraseña para la cuenta de usuario (mínimo 6 caracteres)',
    example: 'passwordStuden123'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // --- Campos del perfil del estudiante ---
  @ApiProperty({ 
    description: 'Código de matrícula del estudiante',
    example: 'SSTT001'
  })
  @IsString()
  @IsNotEmpty()
  enrollmentCode: string;

  @ApiProperty({ 
    description: 'Nombre completo del estudiante',
    example: 'Estudiante de pruebas'
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ 
    description: 'Fecha de nacimiento (formato ISO 8601)',
    example: '1999-12-31'
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({ 
    description: 'ID del grado académico actual (opcional)', 
    required: false,
    example: 1
  })
  @IsNumber()
  @IsOptional()
  currentGradeId?: number | null;
}