import { throwError } from "@/utils/error";
import { formatZodError } from "@/utils/formatZodError";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

type ValidationSchemas = {
	body?: ZodSchema;
	query?: ZodSchema;
	params?: ZodSchema;
};

export default function validate(schemas: ValidationSchemas) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			if (schemas.body) {
				schemas.body.parse(req.body ?? {});
			}
			if (schemas.query) {
				schemas.query.parse(req.query ?? {});
			}
			if (schemas.params) {
				schemas.params.parse(req.params ?? {});
			}
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				throwError("Validation failed", 400, {
					errors: formatZodError(error)
				});
			}
			throwError("Validation failed", 400);
		}
	};
}
