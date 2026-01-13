import { UserRole } from 'src/common/enums/user-role.enum';

export interface User {
  // Datos principales del perfil de usuario (users)
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  isActive: boolean;
  dateOfBirth: Date;
  number_phone: string;

  // Datos del rol (user_roles)
  role?: UserRole;

  createdAt: Date;
  updatedAt: Date;
}
