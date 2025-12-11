import { User } from '../../domain/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  dateOfBirth: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role!;
    this.dateOfBirth = user.dateOfBirth;
  }
}
