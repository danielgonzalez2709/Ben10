import { Router } from 'express';
import { getAllUsers, getUserByUsername, addUser, User } from '../models/usersData';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ben10secret';

const router = Router();

// POST /api/users/register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Faltan datos requeridos' });
  if (getUserByUsername(username)) return res.status(409).json({ error: 'El usuario ya existe' });
  const newUser: User = {
    id: uuidv4(),
    username,
    password, // En producción, hashear
    createdAt: new Date().toISOString()
  };
  addUser(newUser);
  res.status(201).json({ message: 'Usuario registrado correctamente' });
});

// POST /api/users/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Faltan datos requeridos' });
  const user = getUserByUsername(username);
  if (!user || user.password !== password) return res.status(401).json({ error: 'Credenciales inválidas' });
  const isSuperUser = user.username.toLowerCase() === 'ben10';
  const token = jwt.sign({ id: user.id, username: user.username, isSuperUser }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ message: 'Login exitoso', user: { id: user.id, username: user.username, isSuperUser }, token });
});

// GET /api/users
router.get('/', (req, res) => {
  const users = getAllUsers();
  // Solo devolvemos id y username por seguridad
  res.json(users.map(u => ({ id: u.id, username: u.username })));
});

export default router; 