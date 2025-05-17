import jwt from "jsonwebtoken";

export const generateToken = ({
  payload = {},
  signature = process.env.USER_ACCESS_TOKEN,
  options,
} = {}) => {
  const token = jwt.sign(payload, signature, options).toString();
  return token;
};
export const verifyToken = ({
  token = "",
  signature = process.env.USER_ACCESS_TOKEN,
} = {}) => {
  const decoded = jwt.verify(token, signature);
  return decoded;
};
