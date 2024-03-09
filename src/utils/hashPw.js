import bcrypt from "bcrypt";

//encrypting password before saving
export const hashPw = async (inputPassword) => {
  try {
    const SALT_NUMBER = 10;
    const salt = await bcrypt.genSalt(SALT_NUMBER);
    const hash = await bcrypt.hashSync(inputPassword, salt);
    return hash;
  } catch (e) {
    throw e;
  }
};

// compare user password
export const comparePw = async (candidatePw, hashedPw) => {
  const match = await bcrypt.compare(candidatePw, hashedPw);
  return match;
};

// return a JWT token
