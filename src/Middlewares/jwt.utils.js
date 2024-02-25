import jwt from "jsonwebtoken";
const privateKey = process.env.JWT_SECRET || "nodejs-secret-key";
export function signJwt(object, options) {
  return jwt.sign(object, privateKey);
}
export function verifyJwt(token) {
  try {
    const decoded = jwt.verify(token, privateKey);
    return decoded;
  } catch (e) {
    throw e;
  }
}
