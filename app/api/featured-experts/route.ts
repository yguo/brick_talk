import { NextResponse } from 'next/server';
import feeds from '@/data/feeds.json';

export async function GET() {
  try {
    // 现阶段我们仍然从feeds.json获取专家数据
    // 在将来的迭代中，我们可以将专家信息也存储到数据库中
    const featuredExperts = feeds.featured_experts;
    
    return NextResponse.json(featuredExperts);
  } catch (error) {
    console.error('获取精选专家失败:', error);
    return NextResponse.json({ error: '获取精选专家失败' }, { status: 500 });
  }
} 