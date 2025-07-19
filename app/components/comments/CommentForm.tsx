import React, { useState } from 'react';

interface CommentFormProps {
  onSubmit: (comment: import('../../types/comment').Comment) => void;
  placeholder?: string;
  initialValue?: string;
  parentId?: string;
  alienId?: string;
  userId?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  placeholder = 'Escribe un comentario...',
  initialValue = '',
  parentId,
  alienId,
  userId,
}) => {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && alienId && userId) {
      const newComment = {
        id: (window.crypto?.randomUUID?.() || Math.random().toString(36).substr(2, 9)),
        alienId,
        userId,
        content: content.trim(),
        likes: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        isEdited: false,
        parentId,
        replies: [],
      };
      onSubmit(newComment);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex space-x-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={2}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Enviar
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 