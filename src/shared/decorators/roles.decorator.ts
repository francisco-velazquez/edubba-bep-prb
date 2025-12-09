import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/app/modules/users/domain/enums/user-role.enum";

// Clave usada por el RolesGuard para buscar los roles requeridos
export const ROLES_KEY = 'roles';

// Decorador para especificar que roles tienen permiso para acceder a un endpoint
// @param roles Array de roles requeridos (e.g., [UserRole.ADMIN, UserRole.MAESTRO])
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
