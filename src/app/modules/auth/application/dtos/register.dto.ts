import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

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
    example: 'Nombre(s)'
  })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({
    example: 'Apellido(s)'
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ 
    description: 'Fecha de nacimiento (formato ISO 8601)',
    example: '1999-12-31'
  })  
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;
}