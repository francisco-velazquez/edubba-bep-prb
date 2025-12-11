import { User } from "../../domain/entities/user.entity";

export class userProfileDto {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  isActive: boolean;
  email: string;

  constructor(user: User) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.dateOfBirth = user.dateOfBirth;
    this.isActive = user.isActive;
    this.email = user.email;
  }
}