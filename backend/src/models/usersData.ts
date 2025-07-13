import fs from 'fs';
import path from 'path';

export type User = {
  id: string;
  username: string;
  password: string; // En producción, usar hash
  createdAt: string;
};

const DATA_PATH = path.join(__dirname, '../../data/users.json');

function loadUsers(): User[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveUsers(users: User[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(users, null, 2));
}

export function getAllUsers() {
  return loadUsers();
}

export function getUserByUsername(username: string) {
  return loadUsers().find(u => u.username === username);
}

export function getUserById(id: string) {
  return loadUsers().find(u => u.id === id);
}

export function addUser(user: User) {
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
  return user;
} 