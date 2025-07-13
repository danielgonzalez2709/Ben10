import React from 'react';
import type { Alien } from '../../types/alien';
import type { Comment } from '../../types/comment';
import AlienStats from './AlienStats';
import CommentList from '../comments/CommentList';

interface AlienDetailProps {
  alien: Alien;
  comments: Comment[];
  onFavoriteToggle: () => void;
  onAddComment: (content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const AlienDetail: React.FC<AlienDetailProps> = ({
  alien,
  comments,
  onFavoriteToggle,
  onAddComment,
  onLikeComment,
  onEditComment,
  onDeleteComment,
}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuperUser = user && user.isSuperUser;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={alien.image}
            alt={alien.name}
            className="w-full h-96 object-cover"
          />
          {isSuperUser && (
            <button
              onClick={onFavoriteToggle}
              className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              {alien.isFavorite ? '❤️' : '🤍'}
            </button>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{alien.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AlienStats stats={alien.stats} />
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Estado</h3>
                <p className="text-gray-600">
                  {alien.isActive ? 'Alien activo actualmente' : 'Alien inactivo'}
                </p>
                <p className="text-gray-600">
                  Prioridad: {alien.priority}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <CommentList
              comments={comments}
              onAddComment={onAddComment}
              onLikeComment={onLikeComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlienDetail; 