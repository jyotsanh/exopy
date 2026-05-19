import { Role } from "../constants/enum.js";

export interface IJwtPayload {
  id: string;
  role: Role;
  organization_id?: string;

  // standard JWT fields
  iat?: number; // issued at
  exp?: number; // expiration time
}

export interface IRefreshTokenPayload {
  id: string;
}