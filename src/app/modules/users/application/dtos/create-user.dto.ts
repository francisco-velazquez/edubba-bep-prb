import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Correo electrónico único para el usuario' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Contraseña para la cuenta (mínimo 6 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;  

  @ApiProperty({ enum: UserRole, description: 'Rol del usuario en el sistema' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ 
    description: 'Fecha de nacimiento (formato ISO 8601)',
    example: '1999-12-31'
  })  
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;
}