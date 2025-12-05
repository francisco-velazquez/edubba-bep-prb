import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';

export class UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  currentGradeId: number;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.role = user.role;
    this.currentGradeId = user.currentGradeId!;
  }
}
