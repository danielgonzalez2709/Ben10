import fs from 'fs';
import path from 'path';

export type Alien = {
  id: string;
  name: string;
  image?: string;
  category?: string;
  priority: number;
  isFavorite: boolean;
  isActive: boolean;
  stats: {
    strength: number;
    speed: number;
    abilities: string[];
    usageCount: number;
    averageUsageTime: number;
    commentCount: number;
  };
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

export function getAllAliens(): Alien[] {
  return loadAliens();
}

export function getAlienById(id: string): Alien | undefined {
  return loadAliens().find((a) => a.id === id);
}

export function addAlien(alien: Alien): Alien {
  const aliens = loadAliens();
  aliens.push(alien);
  saveAliens(aliens);
  return alien;
}

export function updateAlien(id: string, data: Partial<Alien>): Alien | null {
  const aliens = loadAliens();
  const index = aliens.findIndex((a) => a.id === id);
  if (index === -1) return null;
  aliens[index] = { ...aliens[index], ...data };
  saveAliens(aliens);
  return aliens[index];
}

export function deleteAlien(id: string): Alien | undefined {
  const aliens = loadAliens();
  const alien = aliens.find((a) => a.id === id);
  const filtered = aliens.filter((a) => a.id !== id);
  saveAliens(filtered);
  return alien;
}

export function setAllAliens(newAliens: Alien[]) {
  saveAliens(newAliens);
}
