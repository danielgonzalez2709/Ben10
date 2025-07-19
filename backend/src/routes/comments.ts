import { Router } from 'express';
import { getAllComments, getCommentsByAlien, addComment, updateComment, deleteComment, Comment } from '../models/commentsData';
import { v4 as uuidv4 } from 'uuid';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/comments?alienId=...&sort=likes|date&order=asc|desc
router.get('/', (req, res) => {
  let comments = getAllComments();
  const { alienId, sort, order } = req.query;

  if (typeof alienId === 'string') {
    comments = comments.filter(c => c.alienId === alienId);
  }

  if (typeof sort === 'string') {
    comments = comments.sort((a, b) => {
      let valA: any = a[sort as keyof Comment];
      let valB: any = b[sort as keyof Comment];
      if (sort === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }
      if (valA < valB) return order === 'desc' ? 1 : -1;
      if (valA > valB) return order === 'desc' ? -1 : 1;
      return 0;
    });
  }

  res.json(comments);
});

// POST /api/comments
router.post('/', (req, res) => {
  const { alienId, userId, text, parentId } = req.body;
  if (!alienId || !userId || !text) return res.status(400).json({ error: 'Faltan datos requeridos' });
  const newComment: Comment = {
    id: uuidv4(),
    alienId,
    userId,
    text,
    date: new Date().toISOString(),
    likes: 0,
    ...(parentId ? { parentId } : {})
  };
  addComment(newComment);
  res.status(201).json(newComment);
});

// PUT /api/comments/:id
router.put('/:id', (req, res) => {
  const updated = updateComment(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Comentario no encontrado' });
  res.json(updated);
});

// PUT /api/comments/:id/favorite
router.put('/:id/favorite', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user?.isSuperUser) return res.status(403).json({ error: 'Solo Ben10 puede marcar comentarios favoritos' });
  const updated = updateComment(req.params.id, { favorite: true });
  if (!updated) return res.status(404).json({ error: 'Comentario no encontrado' });
  res.json(updated);
});

// DELETE /api/comments/:id
router.delete('/:id', (req, res) => {
  const deleted = deleteComment(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Comentario no encontrado' });
  res.json(deleted);
});

export default router; 