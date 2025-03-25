import { NextResponse } from 'next/server';
import { getAllPodcasts } from '../../lib/db/podcasts';

export async function GET() {
  try {
    // 从数据库中获取所有播客
    const allPodcasts = getAllPodcasts();
    
    // 按照浏览量排序，获取浏览量最高的10个播客
    const popularPodcasts = [...allPodcasts]
      .sort((a, b) => b.stats.views - a.stats.views)
      .slice(0, 10);
    
    return NextResponse.json(popularPodcasts);
  } catch (error) {
    console.error('获取热门播客失败:', error);
    return NextResponse.json({ error: '获取热门播客失败' }, { status: 500 });
  }
} 