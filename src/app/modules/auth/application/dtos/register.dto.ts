import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsNumber()
  @IsNotEmpty()
  gradeId!: number;
}