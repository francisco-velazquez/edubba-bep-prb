import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'micorreo@email.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'miContraseñaNueva',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'Nombre(s)',
    description: 'Nombre(s) del usuario',
  })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({
    example: 'Apellido(s)',
    description: 'Apellido(s) del usuario',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    description: 'Fecha de nacimiento (formato ISO 8601)',
    example: '1999-12-31',
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  number_phone: string;
}
