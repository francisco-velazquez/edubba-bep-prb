import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GradeLevel } from '../../domain/grade.type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeDto {
  @ApiProperty({
    description: 'Nombre del grado',
    example: 'Primero de primaria',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Grado academico',
    example: GradeLevel.PRIMARY,
    enum: GradeLevel,
  })
  @IsNotEmpty()
  @IsEnum(GradeLevel)
  level: GradeLevel;

  @ApiProperty({
    example: 'PRM_1',
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}
