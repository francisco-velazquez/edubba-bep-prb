import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateExamDto {
  @ApiProperty({
    example: 'Examen de Programación',
    description: 'Título del examen',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 1,
    description: 'ID del módulo al que pertenece el examen',
    required: true,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  moduleId: number;
}
