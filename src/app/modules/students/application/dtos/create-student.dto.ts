import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsUUID('4')
  @IsNotEmpty()
  // ID heredado de la cuenta de usuario previamente creada (clave foránea a users)
  userId: string; 

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
    description: 'ID del grado académico actual (opcional)', 
    required: false,
    example: 1
  })  
  @IsNumber()
  @IsOptional()
  currentGradeId?: number | null;
}