import bcrypt from "bcryptjs";
export const hashedPassword = async (plain_password: string) => {
	try {
		if (!plain_password) throw new Error("Password must be a valid string");
		const salt = await bcrypt.genSalt(
			Number(process.env.HASH_SALT as string)
		);
		const hash = await bcrypt.hash(plain_password, salt);
		return hash;
	} catch (error) {
		console.log("while hashing error");
		return false;
	}
};
