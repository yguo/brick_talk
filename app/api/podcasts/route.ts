import { NextResponse } from 'next/server';
import { getAllPodcasts, createPodcast } from '../../../app/lib/db/podcasts';

// 获取所有播客
export async function GET() {
  try {
    const podcasts = getAllPodcasts();
    return NextResponse.json(podcasts);
  } catch (error) {
    console.error('获取播客列表失败:', error);
    return NextResponse.json({ error: '获取播客列表失败' }, { status: 500 });
  }
}

// 创建新播客
export async function POST(request: Request) {
  try {
    const podcastData = await request.json();
    console.log('收到创建播客请求:', podcastData);
    
    // 确保发布时间是有效的ISO日期字符串
    if (podcastData.publishedAt && typeof podcastData.publishedAt === 'string') {
      try {
        // 尝试解析日期并重新格式化，确保符合ISO标准
        const date = new Date(podcastData.publishedAt);
        podcastData.publishedAt = date.toISOString();
      } catch (e) {
        console.error('日期格式化错误:', e);
        // 如果无法解析，使用当前时间
        podcastData.publishedAt = new Date().toISOString();
      }
    }
    
    const newPodcast = createPodcast(podcastData);
    console.log('创建播客成功:', newPodcast);
    return NextResponse.json(newPodcast, { status: 201 });
  } catch (error) {
    console.error('创建播客失败:', error);
    // 提供更详细的错误信息
    const errorMessage = error instanceof Error ? error.message : '创建播客失败';
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 400 }
    );
  }
} 