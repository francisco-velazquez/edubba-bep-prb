import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { FindUserByEmailUseCase } from 'src/app/modules/users/application/use-cases/find-user-by-email.use-case';
import type { ITokenServicePort } from '../../domain/ports/i-token-service.port';
import { LoginDto } from '../dtos/login.dto';
import { JwtPayload, LoginResult } from '../../domain/types/jwt-payload.type';
import { UserResponseDto } from 'src/app/modules/users/application/dtos/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    @Inject('ITokenServicePort')
    private readonly tokenService: ITokenServicePort,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    // Obtenemos el usuario (usamos el método ForAuth del UserModel que nos devuelve la entidad completa)
    const user = await this.findUserByEmailUseCase.executeForAuth(dto.email);

    // Verificamos el usuario y si esta activo
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credentials invalid or inactive user');
    }

    // Validamos la contraseña
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    // Creamos el payload del token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role!,
    };

    // Generamos el token a travez del port
    const accessToken = await this.tokenService.generateToken(payload);

    // Convertimos la entidad User obtenida directamente a UserResponseDto
    const userResponse = new UserResponseDto(user);

    return {
      user: userResponse,
      accessToken,
    };
  }
}
