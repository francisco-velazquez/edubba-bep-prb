import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    example: 'micorreo@email.com'
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'miContraseñaNueva'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'Mi Nombre Completo'
  })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiProperty({
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  gradeId!: number;
}