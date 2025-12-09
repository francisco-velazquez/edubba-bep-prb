import { UserResponseDto } from "src/app/modules/users/application/dtos/user-response.dto";
import { UserRole } from "src/app/modules/users/domain/enums/user-role.enum";

export interface JwtPayload {
  sub: string; // User Id (UUID)
  email: string;
  role: UserRole;
}

export interface LoginResult {
    user: UserResponseDto;
    accessToken: string;
}