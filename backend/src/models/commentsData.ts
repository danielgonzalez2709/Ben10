import fs from 'fs';
import path from 'path';

export type Comment = {
  id: string;
  alienId: string;
  userId: string;
  text: string;
  date: string;
  likes: number;
  favorite?: boolean;
  parentId?: string;
  likedBy?: string[];
};

const DATA_PATH = path.join(__dirname, '../../data/comments.json');

function loadComments(): Comment[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveComments(comments: Comment[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(comments, null, 2));
}

export function getAllComments() {
  return loadComments();
}

export function getCommentsByAlien(alienId: string) {
  return loadComments().filter(c => c.alienId === alienId);
}

export function addComment(comment: Comment) {
  const comments = loadComments();
  comments.push({ ...comment, likedBy: comment.likedBy || [] });
  saveComments(comments);
  return comment;
}

export function updateComment(id: string, data: Partial<Comment>) {
  const comments = loadComments();
  const idx = comments.findIndex(c => c.id === id);
  if (idx === -1) return null;
  comments[idx] = { ...comments[idx], ...data };
  saveComments(comments);
  return comments[idx];
}

export function deleteComment(id: string) {
  let comments = loadComments();
  const comment = comments.find(c => c.id === id);
  comments = comments.filter(c => c.id !== id);
  saveComments(comments);
  return comment;
}

export function likeComment(id: string, userId: string) {
  const comments = loadComments();
  const idx = comments.findIndex(c => c.id === id);
  if (idx === -1) return null;
  const comment = comments[idx];
  if (!comment.likedBy) comment.likedBy = [];
  if (comment.likedBy.includes(userId)) return comment; // Ya dio like
  comment.likes += 1;
  comment.likedBy.push(userId);
  comments[idx] = comment;
  saveComments(comments);
  return comment;
}

export function unlikeComment(id: string, userId: string) {
  const comments = loadComments();
  const idx = comments.findIndex(c => c.id === id);
  if (idx === -1) return null;
  const comment = comments[idx];
  if (!comment.likedBy) comment.likedBy = [];
  if (!comment.likedBy.includes(userId)) return comment; // No ha dado like
  comment.likes = Math.max(0, comment.likes - 1);
  comment.likedBy = comment.likedBy.filter(uid => uid !== userId);
  comments[idx] = comment;
  saveComments(comments);
  return comment;
} 