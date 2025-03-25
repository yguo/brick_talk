import { NextResponse } from 'next/server';
import { getPodcastById, updatePodcast, deletePodcast } from '../../../../app/lib/db/podcasts';

interface RouteParams {
  params: {
    id: string;
  };
}

// 获取单个播客
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = params;
  
  try {
    const podcast = getPodcastById(id);
    
    if (!podcast) {
      return NextResponse.json({ error: '播客不存在' }, { status: 404 });
    }
    
    return NextResponse.json(podcast);
  } catch (error) {
    console.error(`获取播客 ${id} 失败:`, error);
    return NextResponse.json({ error: '获取播客失败' }, { status: 500 });
  }
}

// 更新播客
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = params;
  
  try {
    const podcastData = await request.json();
    const updatedPodcast = updatePodcast(id, podcastData);
    
    if (!updatedPodcast) {
      return NextResponse.json({ error: '播客不存在' }, { status: 404 });
    }
    
    return NextResponse.json(updatedPodcast);
  } catch (error) {
    console.error(`更新播客 ${id} 失败:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '更新播客失败' }, 
      { status: 400 }
    );
  }
}

// 删除播客
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = params;
  
  try {
    const result = deletePodcast(id);
    
    if (!result) {
      return NextResponse.json({ error: '播客不存在' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`删除播客 ${id} 失败:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '删除播客失败' }, 
      { status: 400 }
    );
  }
} 