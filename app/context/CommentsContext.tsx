import React, { createContext, useContext, useState } from 'react';
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
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const addComment = (comment: Comment) => {
    setComments(prev => [
      {
        ...comment,
        replies: comment.replies ?? [],
      },
      ...prev
    ]);
  };

  const editComment = (id: string, content: string) => {
    setComments(prev => prev.map(c =>
      c.id === id ? { ...c, content, isEdited: true, updatedAt: new Date() } : c
    ));
  };

  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id && c.parentId !== id));
  };

  const likeComment = (id: string) => {
    setComments(prev => prev.map(c =>
      c.id === id ? { ...c, likes: c.likes + 1 } : c
    ));
  };

  return (
    <CommentsContext.Provider value={{ comments, setComments, addComment, editComment, deleteComment, likeComment }}>
      {children}
    </CommentsContext.Provider>
  );
}; 