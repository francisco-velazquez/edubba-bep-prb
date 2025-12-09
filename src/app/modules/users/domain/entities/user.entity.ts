import { UserRole } from '../enums/user-role.enum';

export interface User {
  // Datos principales del perfil de usuario (users)
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  isActive: boolean;

  // Datos del rol (user_roles)
  role: UserRole;

  // Datos académicos
  currentGradeId?: number;
  currentGrade?: any; //TODO: Cambiarlo por AcademicGrade; // Relación con la entidad Grade

  createdAt: Date;
  updatedAt: Date;
}
