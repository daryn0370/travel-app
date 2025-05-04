import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'ваш_супер_секрет';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
