import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsUUID()
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
    description: 'ID del grado académico actual (opcional)', 
    required: false,
    example: 1
  })  
  @IsNumber()
  @IsOptional()
  currentGradeId?: number | null;
}