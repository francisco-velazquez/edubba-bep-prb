import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../../domain/types/jwt-payload.type";

// Nota: Necesitamos definir el secreto en las variables de entorno para esto
// Al usar Supabase, la clave secreta debe de ser la misma que la que ocupa supabase para firmar tokens
const JWT_SECTRET = 'CLAVE_SECRETA' // User ConfigService en producción

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECTRET,
    });
  }

  // Este método se ejecuta despúes de validar la firma del token
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Aquí se pueden realizar todas las verificaciones adicionales para validar
    // que realmente sea correcto y valido el token
    return payload;
  }
}