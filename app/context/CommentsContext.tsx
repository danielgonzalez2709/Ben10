import React, { createContext, useContext, useState, useEffect } from 'react';
import { comments as initialComments } from '../data/comments';
import type { Comment } from '../types/comment';

interface CommentsContextType {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  addComment: (comment: Comment) => void;
  editComment: (id: string, content: string) => void;
  deleteComment: (id: string) => void;
  likeComment: (id: string) => void;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) throw new Error('useComments debe usarse dentro de CommentsProvider');
  return context;
};

export const CommentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  // Cargar comentarios desde el backend al iniciar
  useEffect(() => {
    fetch('http://localhost:3001/api/comments')
      .then(res => res.json())
      .then(data => {
        // Mapear los comentarios del backend al formato esperado en el frontend
        const mapped = data.map((c: any) => ({
          ...c,
          createdAt: c.date ? new Date(c.date) : new Date(),
          updatedAt: c.date ? new Date(c.date) : new Date(),
          content: c.text,
        }));
        // Anidar comentarios
        const map = new Map<string, Comment & { replies: Comment[] }>();
        mapped.forEach((comment: Comment) => {
          map.set(comment.id, { ...comment, replies: [] });
        });
        const roots: (Comment & { replies: Comment[] })[] = [];
        map.forEach((comment: Comment & { replies: Comment[] }) => {
          if (comment.parentId) {
            const parent = map.get(comment.parentId);
            if (parent) parent.replies.push(comment);
          } else {
            roots.push(comment);
          }
        });
        setComments(roots);
      });
  }, []);

  const addComment = async (comment: Comment) => {
    // El backend espera: alienId, userId, text, parentId (opcional)
    const body: any = {
      alienId: comment.alienId,
      userId: comment.userId,
      text: comment.content,
    };
    if (comment.parentId) body.parentId = comment.parentId;
    const res = await fetch('http://localhost:3001/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const saved = await res.json();
      const mapped = {
        ...saved,
        createdAt: saved.date ? new Date(saved.date) : new Date(),
        updatedAt: saved.date ? new Date(saved.date) : new Date(),
        content: saved.text,
      };
      // Recargar todos los comentarios para mantener la estructura anidada
      fetch('http://localhost:3001/api/comments')
        .then(res => res.json())
        .then(data => {
          const mappedAll = data.map((c: any) => ({
            ...c,
            createdAt: c.date ? new Date(c.date) : new Date(),
            updatedAt: c.date ? new Date(c.date) : new Date(),
            content: c.text,
          }));
          const map = new Map<string, Comment & { replies: Comment[] }>();
          mappedAll.forEach((comment: Comment) => {
            map.set(comment.id, { ...comment, replies: [] });
          });
          const roots: (Comment & { replies: Comment[] })[] = [];
          map.forEach((comment: Comment & { replies: Comment[] }) => {
            if (comment.parentId) {
              const parent = map.get(comment.parentId);
              if (parent) parent.replies.push(comment);
            } else {
              roots.push(comment);
            }
          });
          setComments(roots);
        });
    }
  };

  const editComment = (id: string, content: string) => {
    setComments(prev => prev.map(c =>
      c.id === id ? { ...c, content, isEdited: true, updatedAt: new Date() } : c
    ));
  };

  const deleteComment = async (id: string) => {
    const res = await fetch(`http://localhost:3001/api/comments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      // Recargar todos los comentarios para mantener la estructura anidada
      fetch('http://localhost:3001/api/comments')
        .then(res => res.json())
        .then(data => {
          const mappedAll = data.map((c: any) => ({
            ...c,
            createdAt: c.date ? new Date(c.date) : new Date(),
            updatedAt: c.date ? new Date(c.date) : new Date(),
            content: c.text,
          }));
          const map = new Map<string, Comment & { replies: Comment[] }>();
          mappedAll.forEach((comment: Comment) => {
            map.set(comment.id, { ...comment, replies: [] });
          });
          const roots: (Comment & { replies: Comment[] })[] = [];
          map.forEach((comment: Comment & { replies: Comment[] }) => {
            if (comment.parentId) {
              const parent = map.get(comment.parentId);
              if (parent) parent.replies.push(comment);
            } else {
              roots.push(comment);
            }
          });
          setComments(roots);
        });
    }
  };

  const likeComment = async (id: string, alreadyLiked: boolean) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user?.id) return;
    const endpoint = alreadyLiked ? 'unlike' : 'like';
    const res = await fetch(`http://localhost:3001/api/comments/${id}/${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });
    if (res.ok) {
      // Recargar todos los comentarios para mantener la estructura anidada
      fetch('http://localhost:3001/api/comments')
        .then(res => res.json())
        .then(data => {
          const mappedAll = data.map((c: any) => ({
            ...c,
            createdAt: c.date ? new Date(c.date) : new Date(),
            updatedAt: c.date ? new Date(c.date) : new Date(),
            content: c.text,
          }));
          const map = new Map<string, Comment & { replies: Comment[] }>();
          mappedAll.forEach((comment: Comment) => {
            map.set(comment.id, { ...comment, replies: [] });
          });
          const roots: (Comment & { replies: Comment[] })[] = [];
          map.forEach((comment: Comment & { replies: Comment[] }) => {
            if (comment.parentId) {
              const parent = map.get(comment.parentId);
              if (parent) parent.replies.push(comment);
            } else {
              roots.push(comment);
            }
          });
          setComments(roots);
        });
    }
  };

  return (
    <CommentsContext.Provider value={{ comments, setComments, addComment, editComment, deleteComment, likeComment }}>
      {children}
    </CommentsContext.Provider>
  );
}; 