import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "src/app/modules/users/domain/enums/user-role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtenemos los roles requeridos del decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(), // Buscar roles en el método (ej. @Post())
      context.getClass(), // Busca roles en la clase (ej. @Controller())
    ]);

    // Si no hay roles definidos, el acceso esta permitido por defecto
    if(!requiredRoles) {
      return true;
    }

    // Obtener la información del usuario
    // El user es el payload del jwt que fue adjuntado a la request por JwtStrategy
    const { user } = context.switchToHttp().getRequest();

    if(!user || !user.role) {
      return false;
    }

    // Lógica de autorización
    // Verificamos si el rol del usuario esta incluido en la lista de roles requeridos
    return requiredRoles.some((role) => user.role === role);
  }
}