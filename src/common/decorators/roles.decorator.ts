import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

// 🔑 La llave que usaremos para recuperar los metadatos en el RolesGuard
export const ROLES_KEY = 'roles';

// 🔑 El decorador que acepta un array de roles
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
