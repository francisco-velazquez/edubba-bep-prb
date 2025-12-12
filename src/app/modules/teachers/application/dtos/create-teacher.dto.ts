import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTeacherDto {
  @ApiProperty({ example: 'jroedddgrewrg' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsOptional()
  employeeNumber?: string;

  @ApiProperty({ example: 'Matemáticas' })
  @IsString()
  @IsOptional()
  specialty?: string;
}
