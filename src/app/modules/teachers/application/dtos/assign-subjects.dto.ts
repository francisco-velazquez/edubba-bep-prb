import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export class AssignSubjectsDto {
  @ApiProperty({
    type: [Number],
    example: [1, 2, 3],
    description: 'Array de IDs de las asignaturas',
  })
  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  subjectIds: number[];
}
