import React from 'react';
import type { Comment } from '../../types/comment';
import CommentForm from './CommentForm';

interface CommentListProps {
  comments: Comment[];
  onAddComment: (comment: Comment) => void;
  onLikeComment: (commentId: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onAddComment,
  onLikeComment,
  onEditComment,
  onDeleteComment,
}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const alienId = comments[0]?.alienId || '';
  const renderComment = (comment: Comment, level: number = 0) => {
    return (
      <div key={comment.id} className={`ml-${level * 4} mb-4`}>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Usuario {comment.userId}</span>
              <span className="text-gray-500 text-sm">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onLikeComment(comment.id)}
                className="text-gray-500 hover:text-red-500"
              >
                ❤️ {comment.likes}
              </button>
              <button
                onClick={() => onEditComment(comment.id, comment.content)}
                className="text-gray-500 hover:text-blue-500"
              >
                ✏️
              </button>
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="text-gray-500 hover:text-red-500"
              >
                🗑️
              </button>
            </div>
          </div>
          <p className="text-gray-700 mb-2">{comment.content}</p>
          <CommentForm
            onSubmit={onAddComment}
            placeholder="Responder a este comentario..."
            parentId={comment.id}
            alienId={comment.alienId}
            userId={comment.userId}
          />
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map((reply) => renderComment(reply, level + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Comentarios</h3>
      <CommentForm onSubmit={onAddComment} alienId={alienId} userId={user.id || 'anon'} />
      <div className="mt-4">
        {comments
          .filter((comment) => !comment.parentId)
          .sort((a, b) => b.likes - a.likes)
          .map((comment) => renderComment(comment))}
      </div>
    </div>
  );
};

export default CommentList; 