import feeds from '@/data/feeds.json';

export type Podcast = {
  id: string;
  title: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  duration: string;
  type: 'audio' | 'video';
  publishedAt: string;
  cover: string;
  description: string;
  url: string;
  tags: string[];
  experts: Array<{
    name: string;
    avatar: string;
    comment: string;
  }>;
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
};

export type Expert = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  expertise: string[];
  social: {
    twitter: string;
    linkedin: string;
  };
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

export async function getTrendingPodcasts(): Promise<Podcast[]> {
  // 在实际应用中，这里会是一个真实的 API 调用
  return feeds.trending_podcasts as Podcast[];
}

export async function getPopularPodcasts(): Promise<Podcast[]> {
  return feeds.popular_podcasts as Podcast[];
}

export async function getFeaturedExperts(): Promise<Expert[]> {
  return feeds.featured_experts as Expert[];
}

export async function getCategories(): Promise<Category[]> {
  return feeds.categories as Category[];
}

export async function getPodcastById(id: string): Promise<Podcast | null> {
  const allPodcasts = [...feeds.trending_podcasts, ...feeds.popular_podcasts] as Podcast[];
  return allPodcasts.find(podcast => podcast.id === id) || null;
}

export async function getExpertById(id: string): Promise<Expert | null> {
  return feeds.featured_experts.find(expert => expert.id === id) as Expert || null;
}

export async function getPodcastsByCategory(categorySlug: string): Promise<Podcast[]> {
  const allPodcasts = [...feeds.trending_podcasts, ...feeds.popular_podcasts] as Podcast[];
  return allPodcasts.filter(podcast => 
    podcast.tags.some(tag => 
      tag.toLowerCase() === categorySlug.toLowerCase()
    )
  );
}

export async function searchPodcasts(query: string): Promise<Podcast[]> {
  const allPodcasts = [...feeds.trending_podcasts, ...feeds.popular_podcasts] as Podcast[];
  const searchTerm = query.toLowerCase();
  
  return allPodcasts.filter(podcast => 
    podcast.title.toLowerCase().includes(searchTerm) ||
    podcast.description.toLowerCase().includes(searchTerm) ||
    podcast.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
} 