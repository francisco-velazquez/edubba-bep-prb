import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSubjectDto } from './create-subject.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {
  @ApiProperty({
    example: true,
    description: 'Indica si la materia está activa o no',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
