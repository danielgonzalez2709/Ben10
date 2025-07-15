import { Router } from 'express';
import {
  getAllAliens,
  getAlienById,
  addAlien,
  updateAlien,
  deleteAlien,
  Alien,
  setAllAliens,
} from '../models/aliensData';
import { v4 as uuidv4 } from 'uuid';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/aliens?name=...&sort=...&order=asc|desc
router.get('/', (req, res) => {
  let aliens = getAllAliens();
  const { name, sort, order } = req.query;

  // Filtro por nombre
  if (typeof name === 'string' && name.trim() !== '') {
    aliens = aliens.filter(a =>
      a.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Ordenamiento por campos normales o dentro de stats
  if (typeof sort === 'string') {
    aliens = aliens.sort((a, b) => {
      let valA: any = a[sort as keyof Alien];
      let valB: any = b[sort as keyof Alien];

      if (sort === 'strength' || sort === 'speed') {
        valA = a.stats[sort];
        valB = b.stats[sort];
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return order === 'desc' ? 1 : -1;
      if (valA > valB) return order === 'desc' ? -1 : 1;
      return 0;
    });
  }

  res.json(aliens);
});

// GET /api/aliens/:id
router.get('/:id', (req, res) => {
  const alien = getAlienById(req.params.id);
  if (!alien) return res.status(404).json({ error: 'Alien no encontrado' });
  res.json(alien);
});

// POST /api/aliens
router.post('/', (req, res) => {
  const { name, image, stats, favorite, isActive, priority, category } = req.body;
  if (!name || !stats) return res.status(400).json({ error: 'Faltan datos requeridos' });

  const newAlien: Alien = {
    id: uuidv4(),
    name,
    image: image || '',
    stats,
    isFavorite: !!favorite,
    isActive: !!isActive,
    priority: priority ?? 5,
    category: category || 'default',
  };

  addAlien(newAlien);
  res.status(201).json(newAlien);
});

// PUT /api/aliens/:id
router.put('/:id', (req, res) => {
  const updated = updateAlien(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Alien no encontrado' });
  res.json(updated);
});

// PUT /api/aliens/:id/favorite
router.put('/:id/favorite', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user?.isSuperUser)
    return res.status(403).json({ error: 'Solo Ben10 puede marcar favoritos' });

  const updated = updateAlien(req.params.id, { isFavorite: true });
  if (!updated) return res.status(404).json({ error: 'Alien no encontrado' });
  res.json(updated);
});

// PUT /api/aliens/:id/activate
router.put('/:id/activate', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user?.isSuperUser)
    return res.status(403).json({ error: 'Solo Ben10 puede activar aliens' });

  const aliens = getAllAliens();
  const found = aliens.find(a => String(a.id) === String(req.params.id));
  if (!found) return res.status(404).json({ error: 'Alien no encontrado' });

  aliens.forEach(a => {
    a.isActive = false;
  });

  found.isActive = true;
  setAllAliens(aliens);
  res.json({
    message: `Alien ${found.name} activado por Ben10`,
    activeAlien: found,
  });
});

// DELETE /api/aliens/:id
router.delete('/:id', (req, res) => {
  const deleted = deleteAlien(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Alien no encontrado' });
  res.json(deleted);
});

export default router;
