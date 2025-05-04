import { verifyToken } from '../jwt.js';

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Не авторизован' });
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.clearCookie('token');
    return res.status(401).json({ error: 'Невалидный токен' });
  }
  req.user = payload;
  next();
}
