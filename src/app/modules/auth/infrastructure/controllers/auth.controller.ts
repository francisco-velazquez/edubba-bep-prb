import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginUserUseCase } from "../../application/use-cases/login-user.use-case";
import { LoginDto } from "../../application/dtos/login.dto";
import { LoginResult } from "../../domain/types/jwt-payload.type";
import { RegisterDto } from "../../application/dtos/register.dto";
import { UserResponseDto } from "src/app/modules/users/application/dtos/user-response.dto";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<LoginResult> {
    // El dto ya fue validado por los pipes globales
    return this.loginUserUseCase.execute(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<UserResponseDto> {
    return this.registerUserUseCase.execute(dto);
  }
}