// import { IJwtPayload } from "../../interface/jwt.interface.ts";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: IJwtPayload;
//     }
//   }
// }

declare namespace Express {
  export interface Request {
    user?: {
      _id?: string;
      role?: string;
      organization_id?: string;
    };
  }
}
