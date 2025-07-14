import fs from 'fs';
import path from 'path';

export type Alien = {
  id: string;
  name: string;
  image?: string;
  stats: {
    strength: number;
    speed: number;
    abilities: string[];
  };
  favorite?: boolean;
  isActive?: boolean;
};

const DATA_PATH = path.join(__dirname, '../../data/aliens.json');

function loadAliens(): Alien[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveAliens(aliens: Alien[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(aliens, null, 2));
}

export function getAllAliens() {
  return loadAliens();
}

export function getAlienById(id: string) {
  return loadAliens().find(a => a.id === id);
}

export function addAlien(alien: Alien) {
  const aliens = loadAliens();
  aliens.push(alien);
  saveAliens(aliens);
  return alien;
}

export function updateAlien(id: string, data: Partial<Alien>) {
  const aliens = loadAliens();
  const idx = aliens.findIndex(a => a.id === id);
  if (idx === -1) return null;
  aliens[idx] = { ...aliens[idx], ...data };
  saveAliens(aliens);
  return aliens[idx];
}

export function deleteAlien(id: string) {
  let aliens = loadAliens();
  const alien = aliens.find(a => a.id === id);
  aliens = aliens.filter(a => a.id !== id);
  saveAliens(aliens);
  return alien;
}

export function setAllAliens(newAliens: Alien[]) {
  saveAliens(newAliens);
} 