declare namespace Express {
  export interface Request {
    user?: {
      _id?: string;
      role?: string;
      org_id?: string;
    };
  }
}
