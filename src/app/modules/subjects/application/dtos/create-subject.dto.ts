import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty({ example: 'Matemáticas', description: 'Nombre de la materia' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'ID del grado al que pertenece la materia',
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  gradeId: number;
}
