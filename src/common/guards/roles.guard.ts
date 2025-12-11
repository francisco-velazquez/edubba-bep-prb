import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRole } from "src/common/enums/user-role.enum";
import { ROLES_KEY } from "src/shared/decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtenemos los roles requeridos d3el meta data de la ruta
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY,[
      context.getHandler(), // Buscar roles en el método controlador
      context.getClass(), // Buscar roles en los controladores
    ]);

    // Si no se requiere ningún rol se permite el acceso por default
    if(!requiredRoles) {
      return true
    }

    // Obtenemos el usuario de la petición, inyectado por JWTAuthGuard
    // El request.user es el objeto que devuelve el JwtAuthStrategy
    const { user } = context.switchToHttp().getRequest();

    if(!user) {
      return false;
    }

    // Lógica de autorización
    // Comprobamos si el rol del usuario esta incluidos entre los roles requeridos por la ruta
    const hasRole = requiredRoles.some((role) => user.role === role);

    return hasRole;
  }
}