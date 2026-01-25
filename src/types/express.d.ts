// src/types/express.d.ts
import { CaslAbility } from "@/abilities/casl"; // adjust path
import { AuthUser } from ".";

declare global {
	namespace Express {
		interface Request {
			ability?: CaslAbility;
			user?: AuthUser; // optional, if you also attach user
		}
	}
}
