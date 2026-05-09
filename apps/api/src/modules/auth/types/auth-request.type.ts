import { Request } from 'express';
import { UserRole } from '../../users/enums/user-role.enum';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
