'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

interface Expert {
  name: string;
  avatar: string;
  comment?: string;
}

interface Podcast {
  id: string;
  title: string;
  type: string;
  duration: string;
  publishedAt: string;
  cover: string;
  description: string;
  url: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  tags: string[];
  experts: Expert[];
  stats: {
    views: number;
    likes: number;
    shares: number;
  };
}

export default function PodcastDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const id = params.id as string;

  useEffect(() => {
    // 处理特殊ID "new"，重定向到创建页面
    if (id === 'new') {
      router.push('/admin/podcasts/new/edit');
      return;
    }
    
    // 加载播客详情
    const fetchPodcast = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/podcasts/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('播客不存在');
          }
          throw new Error(`获取数据失败: ${response.status}`);
        }
        
        const data = await response.json();
        setPodcast(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取数据时发生错误');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPodcast();
    }
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('确定要删除这个播客吗？')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/podcasts/${id}`, { method: 'DELETE' });
      
      if (!response.ok) {
        throw new Error(`删除失败: ${response.status}`);
      }
      
      // 删除成功后返回列表页
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除时发生错误');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-8">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-200">
          {error}
        </div>
        <Link href="/admin" className="text-blue-500 hover:underline">
          返回列表
        </Link>
      </div>
    );
  }

  if (!podcast) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-4 p-4 bg-yellow-100 text-yellow-700 rounded border border-yellow-200">
          未找到播客数据
        </div>
        <Link href="/admin" className="text-blue-500 hover:underline">
          返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">播客详情</h1>
        <div className="flex gap-2">
          <Link 
            href="/admin" 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            返回列表
          </Link>
          <Link 
            href={`/admin/podcasts/${id}/edit`} 
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            编辑
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            删除
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="relative h-64 w-full">
          {podcast.cover && (
            <Image
              src={podcast.cover}
              alt={podcast.title}
              fill
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{podcast.title}</h2>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <span>{podcast.type === 'audio' ? '音频' : '视频'}</span>
              <span>•</span>
              <span>{podcast.duration}</span>
              <span>•</span>
              <span>{new Date(podcast.publishedAt).toLocaleString('zh-CN')}</span>
            </div>
            <p className="text-gray-700">{podcast.description}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">作者信息</h3>
            <div className="flex items-center gap-3">
              {podcast.author.avatar && (
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={podcast.author.avatar}
                    alt={podcast.author.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div>
                <div className="font-medium">{podcast.author.name}</div>
                <div className="text-sm text-gray-600">{podcast.author.title}</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">标签</h3>
            <div className="flex flex-wrap gap-2">
              {podcast.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          {podcast.experts && podcast.experts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">专家评论</h3>
              <div className="space-y-4">
                {podcast.experts.map((expert, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center gap-3 mb-2">
                      {expert.avatar && (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={expert.avatar}
                            alt={expert.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      <div className="font-medium">{expert.name}</div>
                    </div>
                    {expert.comment && <p className="text-gray-700">{expert.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">统计数据</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 p-3 rounded text-center">
                <div className="text-xl font-bold">{podcast.stats.views}</div>
                <div className="text-sm text-gray-600">浏览量</div>
              </div>
              <div className="bg-gray-100 p-3 rounded text-center">
                <div className="text-xl font-bold">{podcast.stats.likes}</div>
                <div className="text-sm text-gray-600">点赞</div>
              </div>
              <div className="bg-gray-100 p-3 rounded text-center">
                <div className="text-xl font-bold">{podcast.stats.shares}</div>
                <div className="text-sm text-gray-600">分享</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">媒体链接</h3>
            <div className="bg-gray-100 p-3 rounded">
              <div className="font-mono text-sm break-all">{podcast.url}</div>
              <audio 
                controls 
                className="w-full mt-2"
                src={podcast.url}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 