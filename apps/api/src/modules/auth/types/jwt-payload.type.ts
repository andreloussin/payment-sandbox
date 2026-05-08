import { UserRole } from 'src/modules/users/enums/user-role.enum';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: UserRole;
  isActive: boolean;
  iat?: number;
  exp?: number;
}
