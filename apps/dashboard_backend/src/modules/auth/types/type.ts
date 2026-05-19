

import { Role } from "../../../constants/enum.js";

export type deviceInfo = {
    userAgent?: string;
  ipAddress?: string;
  browser?: string;
  os?: string;
  device?: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: Role; 
    profile_image?: string;
  };
}