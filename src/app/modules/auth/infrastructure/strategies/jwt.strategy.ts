import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../domain/types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { FindUserByEmailUseCase } from 'src/app/modules/users/application/use-cases/find-user-by-email.use-case';

// Nota: Necesitamos definir el secreto en las variables de entorno para esto
// Al usar Supabase, la clave secreta debe de ser la misma que la que ocupa supabase para firmar tokens
// const JWT_SECTRET = 'CLAVE_SECRETA' // User ConfigService en producción

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
  ) {
    const secret = configService.get<string>('JWT_SECRET')!;

    if (!secret) {
      throw new Error('JWT_SECRET no está definido en la configuración.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  // Este método se ejecuta despúes de validar la firma del token
  async validate(payload: JwtPayload) {
    // Buscar el usuario en la base de datos (tabla profiles) usando el email/id del payload
    const user = await this.findUserByEmailUseCase.execute(payload.email);

    if (!user) {
      throw new UnauthorizedException(
        'Token inválido o usuario no encontrado.',
      );
    }

    // Aquí se pueden realizar todas las verificaciones adicionales para validar
    // que realmente sea correcto y valido el token
    return user;
  }
}
