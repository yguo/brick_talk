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
    comment?: string;
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
    twitter?: string;
    linkedin?: string;
    github?: string;
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
  try {
    const response = await fetch('/api/featured-podcasts');
    if (!response.ok) {
      throw new Error('Failed to fetch trending podcasts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending podcasts:', error);
    // 如果API请求失败，回退到硬编码数据
    return feeds.trending_podcasts as Podcast[];
  }
}

export async function getPopularPodcasts(): Promise<Podcast[]> {
  try {
    const response = await fetch('/api/popular-podcasts');
    if (!response.ok) {
      throw new Error('Failed to fetch popular podcasts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching popular podcasts:', error);
    // 如果API请求失败，回退到硬编码数据
    return feeds.popular_podcasts as Podcast[];
  }
}

export async function getFeaturedExperts(): Promise<Expert[]> {
  try {
    const response = await fetch('/api/featured-experts');
    if (!response.ok) {
      throw new Error('Failed to fetch featured experts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured experts:', error);
    // 如果API请求失败，回退到硬编码数据
    return feeds.featured_experts as Expert[];
  }
}

export async function getCategories(): Promise<Category[]> {
  return feeds.categories as Category[];
}

export async function getPodcastById(id: string): Promise<Podcast | null> {
  try {
    const response = await fetch(`/api/podcasts/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch podcast');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching podcast ${id}:`, error);
    // 如果API请求失败，回退到硬编码数据
    const allPodcasts = [...feeds.trending_podcasts, ...feeds.popular_podcasts] as Podcast[];
    return allPodcasts.find(podcast => podcast.id === id) || null;
  }
}

export async function getExpertById(id: string): Promise<Expert | null> {
  return feeds.featured_experts.find(expert => expert.id === id) as Expert || null;
}

export async function getPodcastsByCategory(categorySlug: string): Promise<Podcast[]> {
  try {
    // 获取所有播客，然后在客户端进行过滤
    // 未来可以添加专门的API端点来按分类获取播客
    const allPodcasts = await getTrendingPodcasts();
    const popularPodcasts = await getPopularPodcasts();
    const combinedPodcasts = [...allPodcasts, ...popularPodcasts];
    
    return combinedPodcasts.filter(podcast => 
      podcast.tags.some(tag => 
        tag.toLowerCase() === categorySlug.toLowerCase()
      )
    );
  } catch (error) {
    console.error('Error fetching podcasts by category:', error);
    // 如果API请求失败，回退到硬编码数据
    const allPodcasts = [...feeds.trending_podcasts, ...feeds.popular_podcasts] as Podcast[];
    return allPodcasts.filter(podcast => 
      podcast.tags.some(tag => 
        tag.toLowerCase() === categorySlug.toLowerCase()
      )
    );
  }
}

export async function searchPodcasts(query: string): Promise<Podcast[]> {
  try {
    // 获取所有播客，然后在客户端进行搜索
    // 未来可以添加专门的API端点来搜索播客
    const allPodcasts = await getTrendingPodcasts();
    const popularPodcasts = await getPopularPodcasts();
    const combinedPodcasts = [...allPodcasts, ...popularPodcasts];
    
    const searchTerm = query.toLowerCase();
    
    return combinedPodcasts.filter(podcast => 
      podcast.title.toLowerCase().includes(searchTerm) ||
      podcast.description.toLowerCase().includes(searchTerm) ||
      podcast.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  } catch (error) {
    console.error('Error searching podcasts:', error);
    // 如果API请求失败，回退到硬编码数据
    const allPodcasts = [...feeds.trending_podcasts, ...feeds.popular_podcasts] as Podcast[];
    const searchTerm = query.toLowerCase();
    
    return allPodcasts.filter(podcast => 
      podcast.title.toLowerCase().includes(searchTerm) ||
      podcast.description.toLowerCase().includes(searchTerm) ||
      podcast.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
} 