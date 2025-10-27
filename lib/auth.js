import bcrypt from "bcryptjs";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD_HASH =
  "$2a$10$biLoSgSK1l/sowUic.NIA..ZumT7U9wA26iW3ywZrvCyMhSx.yzPa"; // admin123

const username = process.env.ADMIN_USERNAME || DEFAULT_USERNAME;
const passwordHash =
  process.env.ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH;

export function validateCredentials(providedUsername, providedPassword) {
  if (!providedUsername || !providedPassword) {
    return false;
  }

  if (providedUsername !== username) {
    return false;
  }

  return bcrypt.compareSync(providedPassword, passwordHash);
}
