import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Este método se llama si el token es invalido o no existe
  handlerRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if(err || !user) {
      // info puede contener el motivo del fallo (ejemplo: TokenExpiredError)
      console.error('JWT Auth Error Info: ', info);
      throw err || new UnauthorizedException('Access Denied. Invalid Token');
    }

    return user;
  }
}