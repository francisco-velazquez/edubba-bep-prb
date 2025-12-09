import { Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ITokenServicePort } from "../../domain/ports/i-token-service.port";
import { JwtPayload } from "../../domain/types/jwt-payload.type";

@Injectable()
export class JwtTokenService implements ITokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: JwtPayload): Promise<string> {
    // El método singAsync utiliza el secreto y la configuración definidos en AuthModule
    return this.jwtService.signAsync(payload);
  }

  async validateToken(token: string): Promise<JwtPayload> {
    // El método verifyAsync valida el token
    return this.jwtService.verifyAsync(token);
  }
}