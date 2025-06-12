export interface Comment {
  id: string;
  alienId: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  replies?: Comment[];
  isEdited: boolean;
}

export interface CommentFormData {
  content: string;
  parentId?: string;
} 