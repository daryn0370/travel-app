
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';

import { signToken, verifyToken } from './jwt.js';
import { setJwtCookie, removeJwtCookie } from './cookie.js';
import { authMiddleware } from './middleware/auth.js';

const { Client } = pkg;
const app = express();
const PORT = process.env.PORT || 5000;
const upload = multer({ dest: 'uploads/' });

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'travelwithme',
  password: 'admin',
  port: 5432,
});


client.connect()
  .then(() => console.log('🟢 Connected to PostgreSQL'))
  .catch(err => console.error('🔴 Connection error:', err));

// Регистрация
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await client.query(
      `INSERT INTO registrated_users (email, password, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, avatar, country, language`,
      [email, hash, name]
    );
    const newUser = result.rows[0];
    const token = signToken(newUser);
    setJwtCookie(res, token);
    res.status(201).json({ user: newUser });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Ошибка регистрации' });
  }
});

// Логин
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query(
      'SELECT * FROM registrated_users WHERE email = $1',
      [email]
    );
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password)) {
      const cleanUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        country: user.country,
        language: user.language,
      };
      const token = signToken(cleanUser);
      setJwtCookie(res, token);
      return res.json({ message: 'Успешный вход', user: cleanUser });
    }
    res.status(401).json({ error: 'Неверный email или пароль' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Проверка авторизации
app.get('/api/check-auth', (req, res) => {
  const token = req.cookies.token;
  const payload = token ? verifyToken(token) : null;
  if (payload) {
    return res.json({ isAuthenticated: true, user: payload });
  }
  return res.json({ isAuthenticated: false });
});

// Профиль
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const result = await client.query(
      `SELECT email, name, avatar, country, language
       FROM registrated_users
       WHERE email = $1`,
      [req.user.email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление профиля
app.post(
  '/api/user/profile',
  authMiddleware,
  upload.single('avatar'),
  async (req, res) => {
    const { name, currentPassword, newPassword, country, language } = req.body;
    let avatarUrl = req.user.avatar;

    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }

    try {
      if (currentPassword && newPassword) {
        const dbRes = await client.query(
          'SELECT password FROM registrated_users WHERE email = $1',
          [req.user.email]
        );
        const dbUser = dbRes.rows[0];
        if (!await bcrypt.compare(currentPassword, dbUser.password)) {
          return res.status(400).json({ error: 'Неправильный текущий пароль' });
        }
        const hash = await bcrypt.hash(newPassword, 10);
        await client.query(
          'UPDATE registrated_users SET password = $1 WHERE email = $2',
          [hash, req.user.email]
        );
      }

      await client.query(
        `UPDATE registrated_users
         SET name=$1, avatar=$2, country=$3, language=$4
         WHERE email=$5`,
        [name, avatarUrl, country, language, req.user.email]
      );

      const updated = {
        id: req.user.id,
        email: req.user.email,
        name,
        avatar: avatarUrl,
        country,
        language,
      };
      const newToken = signToken(updated);
      setJwtCookie(res, newToken);

      res.json({ message: 'Профиль обновлён' });
    } catch (err) {
      console.error('Profile update error:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  }
);

// Выход
app.post('/api/logout', (req, res) => {
  removeJwtCookie(res);
  res.json({ message: 'Вы вышли из аккаунта' });
});


// Сохранение билета

// Получение сохранённых билетов пользователя
app.get('/api/user/tickets', authMiddleware, async (req, res) => {
  try {
    const result = await client.query(
      `SELECT t.*
         FROM avia_tickets t
    INNER JOIN user_tickets ut ON ut.ticket_id = t.ticket_id
        WHERE ut.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения билетов пользователя:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Получение сохранённых билетов
app.get('/api/avia-tickets', async (req, res) => {
  const { from, where_to, when, when_back } = req.query;
  console.log('Query params:', req.query);

  const conditions = [];
  const values = [];

  if (from) {
    values.push(from);
    conditions.push(`"From" = $${values.length}`);
  }
  if (where_to) {
    values.push(where_to);
    conditions.push(`"Where_To" = $${values.length}`);
  }
  if (when) {
    values.push(when);
    conditions.push(`DATE("When") = $${values.length}::DATE`);
  }
  if (when_back) {
    values.push(when_back);
    conditions.push(`DATE("When_back") = $${values.length}::DATE`);
  }

  const whereClause = conditions.length
    ? 'WHERE ' + conditions.join(' AND ')
    : '';
  const queryText = `SELECT * FROM avia_tickets ${whereClause}`;
  console.log('SQL:', queryText, 'VALUES:', values);

  try {
    const result = await client.query(queryText, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Tickets fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/user/tickets', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { ticketId } = req.body;
  try {
    await client.query(
      'INSERT INTO user_tickets (user_id, ticket_id) VALUES ($1, $2)',
      [userId, ticketId]
    );
    res.json({ message: 'Билет добавлен' });
  } catch (err) {
    console.error('Ошибка добавления билета:', err);
    res.status(500).json({ error: err.message });
  }
});


// Сохранение отеля
app.post('/api/user/hotels', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { name, city, price, image } = req.body;
  try {
    await client.query(
      `INSERT INTO user_hotels (user_id, name, city, price, image)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, name, city, price, image]
    );
    res.json({ message: 'Отель добавлен' });
  } catch (err) {
    console.error('Ошибка добавления отеля:', err);
    res.status(500).json({ error: err.message });
  }
});

// Получение сохранённых отелей
app.get('/api/user/hotels', authMiddleware, async (req, res) => {
  try {
    const result = await client.query(
      `SELECT id, name, city, price, image
         FROM user_hotels
        WHERE user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения отелей пользователя:', err);
    res.status(500).json({ error: err.message });
  }
});

// Удаление билета
app.delete('/api/user/tickets/:ticketId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const ticketId = parseInt(req.params.ticketId, 10);
  try {
    await client.query(
      'DELETE FROM user_tickets WHERE user_id = $1 AND ticket_id = $2',
      [userId, ticketId]
    );
    res.json({ message: 'Билет удалён' });
  } catch (err) {
    console.error('Ошибка удаления билета:', err);
    res.status(500).json({ error: err.message });
  }
});

// Удаление отеля
app.delete('/api/user/hotels/:id', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id, 10);
  try {
    await client.query(
      'DELETE FROM user_hotels WHERE user_id = $1 AND id = $2',
      [userId, id]
    );
    res.json({ message: 'Отель удалён' });
  } catch (err) {
    console.error('Ошибка удаления отеля:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/user/cars', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { name, city, price, image } = req.body;
  try {
    await client.query(
      `INSERT INTO user_cars (user_id, name, city, price, image)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, name, city, price, image]
    );
    res.json({ message: 'Машина добавлена' });
  } catch (err) {
    console.error('Ошибка добавления машины:', err);
    res.status(500).json({ error: err.message });
  }
});

// Получение сохранённых машин
app.get('/api/user/cars', authMiddleware, async (req, res) => {
  try {
    const result = await client.query(
      `SELECT id, name, city, price, image
         FROM user_cars
        WHERE user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения машин пользователя:', err);
    res.status(500).json({ error: err.message });
  }
});


app.delete('/api/user/cars/:id', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id, 10);
  try {
    await client.query(
      'DELETE FROM user_cars WHERE user_id = $1 AND id = $2',
      [userId, id]
    );
    res.json({ message: 'Машина удалена' });
  } catch (err) {
    console.error('Ошибка удаления машины:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});






























