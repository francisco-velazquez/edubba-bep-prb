import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({
    example: 'Capitulo I',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Id de la asginatura a la que pertecene el modulo',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  subjectId: number;

  @ApiProperty({
    description: 'Indice del orden dentro de la asignatura, iniciamos en 0',
    example: 0,
  })
  @IsInt()
  @IsOptional()
  @IsPositive()
  orderIndex?: number;

  @ApiProperty({
    description: 'Estado del módulo',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
