import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGradeDto } from './create-grade.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateGradeDto extends PartialType(CreateGradeDto) {
  @ApiProperty({
    description: 'Estatus del grado',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
