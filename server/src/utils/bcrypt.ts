import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "./constans";

export function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}
export function comparePasswords(
  password: string,
  hashedPassword: string | undefined | null
) {
  if (!hashedPassword) {
    throw new Error("Hashed password is not available");
  }
  return bcrypt.compareSync(password, hashedPassword);
}
