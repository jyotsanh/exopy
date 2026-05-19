import { ZodSchema } from "zod";
import HttpException from "../utils/httpException.utils.js";

type ValidationTarget = "body" | "params" | "query";

export const validateRequest =
  (schema: ZodSchema, target: ValidationTarget = "body") =>
  (req: any, res: any, next: any) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return next(
        HttpException.badRequest(
          result.error.issues.map((e) => e.message).join(", ")
        )
      );
    }

    // Don't overwrite req.query
    if (target === "query") {
      req.validatedQuery = result.data;
    } else {
      req[target] = result.data;
    }

    next();
  };