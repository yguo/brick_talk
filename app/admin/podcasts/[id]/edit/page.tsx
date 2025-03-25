'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Expert {
  name: string;
  avatar: string;
  comment?: string;
}

interface PodcastFormData {
  title: string;
  type: 'audio' | 'video';
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

export default function EditPodcastPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<PodcastFormData>({
    title: '',
    type: 'audio',
    duration: '',
    publishedAt: new Date().toISOString().slice(0, 16),
    cover: '',
    description: '',
    url: '',
    author: {
      name: '',
      title: '',
      avatar: '',
    },
    tags: [],
    experts: [],
    stats: {
      views: 0,
      likes: 0,
      shares: 0,
    },
  });
  
  const [newTag, setNewTag] = useState('');
  const [newExpert, setNewExpert] = useState<Expert>({
    name: '',
    avatar: '',
    comment: '',
  });
  
  useEffect(() => {
    if (!isNew) {
      fetchPodcast();
    }
  }, [id, isNew]);
  
  const fetchPodcast = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/podcasts/${id}`);
      
      if (!response.ok) {
        throw new Error(`获取播客数据失败: ${response.status}`);
      }
      
      const data = await response.json();
      setFormData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取播客数据失败');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof PodcastFormData] as any),
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      stats: {
        ...formData.stats,
        [name]: parseInt(value) || 0,
      },
    });
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };
  
  const handleExpertChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewExpert({
      ...newExpert,
      [name]: value,
    });
  };
  
  const handleAddExpert = () => {
    if (newExpert.name.trim() && newExpert.avatar.trim()) {
      setFormData({
        ...formData,
        experts: [...formData.experts, { ...newExpert }],
      });
      setNewExpert({
        name: '',
        avatar: '',
        comment: '',
      });
    }
  };
  
  const handleRemoveExpert = (index: number) => {
    setFormData({
      ...formData,
      experts: formData.experts.filter((_, i) => i !== index),
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setSaveError(null);
      
      // 准备提交的数据
      const submitData = {
        ...formData,
        // 确保发布时间是有效的ISO格式字符串
        publishedAt: new Date(formData.publishedAt).toISOString(),
      };
      
      // 打印准备提交的数据，便于调试
      console.log('准备提交的数据:', submitData);
      
      const url = isNew ? '/api/podcasts' : `/api/podcasts/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API响应错误:', errorData);
        throw new Error(errorData.error || `保存失败: ${response.status}`);
      }
      
      const savedPodcast = await response.json();
      console.log('保存成功:', savedPodcast);
      
      router.push(`/admin/podcasts/${savedPodcast.id}`);
    } catch (err) {
      console.error('保存过程中出错:', err);
      setSaveError(err instanceof Error ? err.message : '保存播客数据失败');
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
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
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{isNew ? '创建新播客' : '编辑播客'}</h1>
        <Link 
          href={isNew ? '/admin' : `/admin/podcasts/${id}`}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          取消
        </Link>
      </div>
      
      {saveError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-200">
          {saveError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          {/* 基本信息 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">类型</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="audio">音频</option>
                  <option value="video">视频</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">时长</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="例如: 32:15"
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">发布时间</label>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  value={formData.publishedAt.slice(0, 16)}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">封面图片URL</label>
                <input
                  type="text"
                  name="cover"
                  value={formData.cover}
                  onChange={handleChange}
                  placeholder="https://... 或 /images/..."
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">媒体URL</label>
                <input
                  type="text"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="/podcasts/... 或 https://..."
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">描述</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* 作者信息 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">作者信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  name="author.name"
                  value={formData.author.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">头衔</label>
                <input
                  type="text"
                  name="author.title"
                  value={formData.author.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">头像URL</label>
                <input
                  type="text"
                  name="author.avatar"
                  value={formData.author.avatar}
                  onChange={handleChange}
                  placeholder="/avatars/... 或 https://..."
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* 标签 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">标签</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder="添加标签"
                className="flex-1 px-3 py-2 border rounded"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                添加
              </button>
            </div>
          </div>
          
          {/* 专家评论 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">专家评论</h2>
            
            {formData.experts.map((expert, index) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">{expert.name}</div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExpert(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
                <div className="text-sm text-gray-600 mb-2">Avatar: {expert.avatar}</div>
                {expert.comment && <div className="text-gray-700">{expert.comment}</div>}
              </div>
            ))}
            
            <div className="border rounded p-4">
              <h3 className="font-medium mb-2">添加新专家</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-1">姓名</label>
                  <input
                    type="text"
                    name="name"
                    value={newExpert.name}
                    onChange={handleExpertChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">头像URL</label>
                  <input
                    type="text"
                    name="avatar"
                    value={newExpert.avatar}
                    onChange={handleExpertChange}
                    placeholder="/avatars/... 或 https://..."
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-1">评论</label>
                  <textarea
                    name="comment"
                    value={newExpert.comment || ''}
                    onChange={handleExpertChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleAddExpert}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                添加专家
              </button>
            </div>
          </div>
          
          {/* 统计数据 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">统计数据</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">浏览量</label>
                <input
                  type="number"
                  name="views"
                  value={formData.stats.views}
                  onChange={handleStatsChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">点赞</label>
                <input
                  type="number"
                  name="likes"
                  value={formData.stats.likes}
                  onChange={handleStatsChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">分享</label>
                <input
                  type="number"
                  name="shares"
                  value={formData.stats.shares}
                  onChange={handleStatsChange}
                  min="0"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          {/* 提交按钮 */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              disabled={saving}
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 