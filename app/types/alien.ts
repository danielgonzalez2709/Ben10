export interface Alien {
  id: string;
  name: string;
  image: string;
  stats: {
    usageCount: number;
    averageUsageTime: number;
    commentCount: number;
    strength: number;
    speed: number;
    abilities: string[];
  };
  isFavorite: boolean;
  priority: number;
  isActive: boolean;
}

export interface AlienStats {
  usageCount: number;
  averageUsageTime: number;
  commentCount: number;
  strength: number;
  speed: number;
  abilities: string[];
} 