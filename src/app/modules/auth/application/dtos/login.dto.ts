import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'pruebas@email.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'miContraeñaNueva'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}