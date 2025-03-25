'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Podcast {
  id: string;
  title: string;
  type: string;
  duration: string;
  publishedAt: string;
  author: {
    name: string;
  };
}

export default function AdminPage() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    // 加载播客列表
    fetchPodcasts();
  }, []);

  const fetchPodcasts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/podcasts');
      
      if (!response.ok) {
        throw new Error(`获取数据失败: ${response.status}`);
      }
      
      const data = await response.json();
      setPodcasts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据时发生错误');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async () => {
    try {
      setImportStatus('导入中...');
      const response = await fetch('/api/import', { method: 'POST' });
      
      if (!response.ok) {
        throw new Error(`导入失败: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setImportStatus(`导入成功！共导入 ${result.trendingCount + result.popularCount} 个播客`);
        // 刷新播客列表
        fetchPodcasts();
      } else {
        setImportStatus(`导入失败: ${result.error}`);
      }
    } catch (err) {
      setImportStatus(err instanceof Error ? err.message : '导入过程中发生错误');
    }
  };

  const handleDeletePodcast = async (id: string) => {
    if (!confirm('确定要删除这个播客吗？')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/podcasts/${id}`, { method: 'DELETE' });
      
      if (!response.ok) {
        throw new Error(`删除失败: ${response.status}`);
      }
      
      // 刷新播客列表
      fetchPodcasts();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除时发生错误');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">播客管理系统</h1>
      
      <div className="mb-6 flex gap-4">
        <button
          onClick={handleImportData}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          导入数据
        </button>
        
        <Link 
          href="/admin/podcasts/new/edit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          创建新播客
        </Link>
      </div>
      
      {importStatus && (
        <div className="mb-4 p-4 bg-gray-100 rounded border">
          {importStatus}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">加载中...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border text-left">标题</th>
                <th className="py-2 px-4 border text-left">类型</th>
                <th className="py-2 px-4 border text-left">时长</th>
                <th className="py-2 px-4 border text-left">发布时间</th>
                <th className="py-2 px-4 border text-left">作者</th>
                <th className="py-2 px-4 border text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {podcasts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 px-4 border text-center">
                    没有找到数据，请导入或创建新播客
                  </td>
                </tr>
              ) : (
                podcasts.map((podcast) => (
                  <tr key={podcast.id}>
                    <td className="py-2 px-4 border">{podcast.title}</td>
                    <td className="py-2 px-4 border">{podcast.type}</td>
                    <td className="py-2 px-4 border">{podcast.duration}</td>
                    <td className="py-2 px-4 border">
                      {new Date(podcast.publishedAt).toLocaleString('zh-CN')}
                    </td>
                    <td className="py-2 px-4 border">{podcast.author.name}</td>
                    <td className="py-2 px-4 border">
                      <div className="flex gap-2">
                        <Link 
                          href={`/admin/podcasts/${podcast.id}`}
                          className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                        >
                          查看
                        </Link>
                        <Link 
                          href={`/admin/podcasts/${podcast.id}/edit`}
                          className="px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDeletePodcast(podcast.id)}
                          className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 