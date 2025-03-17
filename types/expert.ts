export interface Expert {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  podcastCount: number;
  stats: {
    views: number;
    likes: number;
  };
} 