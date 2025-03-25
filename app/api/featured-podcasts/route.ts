import { NextResponse } from 'next/server';
import { getAllPodcasts } from '../../lib/db/podcasts';

export async function GET() {
  try {
    // 从数据库中获取所有播客
    const allPodcasts = getAllPodcasts();
    
    // 获取最新的6个播客作为精选播客
    const featuredPodcasts = allPodcasts.slice(0, 6);
    
    return NextResponse.json(featuredPodcasts);
  } catch (error) {
    console.error('获取精选播客失败:', error);
    return NextResponse.json({ error: '获取精选播客失败' }, { status: 500 });
  }
} 