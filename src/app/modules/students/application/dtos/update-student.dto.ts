import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateStudentDto {
  @ApiProperty({ example: 'Matricula del alumno' })
  @IsString()
  @IsOptional()
  enrollmentCode?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsOptional()
  currentGradeId?: number;
}