'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { SearchIcon, ArrowRightIcon, MicIcon, TrendingUpIcon, ClockIcon } from 'lucide-react';

// Mock data for recommended podcasts
const recommendedPodcasts = [
  {
    id: 1,
    title: '人工智能的未来发展',
    host: '李明博士',
    episodes: 12,
    image: 'https://source.unsplash.com/random/300x200/?ai,technology',
    trending: true,
  },
  {
    id: 2,
    title: '深度学习实战指南',
    host: '张伟教授',
    episodes: 8,
    image: 'https://source.unsplash.com/random/300x200/?code,neural',
    trending: false,
  },
  {
    id: 3,
    title: '科技创新与AI',
    host: '王芳',
    episodes: 15,
    image: 'https://source.unsplash.com/random/300x200/?innovation,robot',
    trending: true,
  },
];

// Available avatar options for experts
const avatarOptions = [
  '/avatars/Notion Avatar.svg',
  '/avatars/Notion Avatar (1).svg',
  '/avatars/Notion Avatar (2).svg',
  '/avatars/Notion Avatar (3).svg',
  '/avatars/Notion Avatar (4).svg',
  '/avatars/Notion Avatar (5).svg'
];

// Mock data for popular experts
const popularExperts = [
  {
    id: 1,
    name: '陈教授',
    expertise: 'AI 伦理学',
    engagement: 342,
    avatar: '/avatars/Notion Avatar.svg',
    quote: '人工智能不该只追求技术突破，还应考虑社会影响和伦理边界。',
  },
  {
    id: 2,
    name: '刘博士',
    expertise: '机器学习',
    engagement: 289,
    avatar: '/avatars/Notion Avatar (1).svg',
    quote: '大模型的进步不在于参数规模，而在于知识组织和推理能力的突破。',
  },
  {
    id: 3,
    name: '赵工程师',
    expertise: '计算机视觉',
    engagement: 256,
    avatar: '/avatars/Notion Avatar (2).svg',
    quote: '多模态交互将成为未来AI与人类协作的核心场景。',
  },
];

// Fix for podcast images - use static images instead of Unsplash random
const updatedPodcasts = recommendedPodcasts.map((podcast, index) => ({
  ...podcast,
  image: `/images/podcast-${index + 1}.jpg`
}));

export default function AskPage() {
  const [question, setQuestion] = useState('');

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle question submission logic here
    console.log('Question submitted:', question);
  };

  // Function to get a random avatar from available options
  const getRandomAvatar = () => {
    return avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center pt-6 pb-12">
          <h1 className="text-2xl text-gray-800 mb-4">先找到问题，再寻求答案</h1>
          <p className="text-base text-gray-500 mb-8 text-center max-w-xl">
            提出您的问题，获取来自顶尖 AI 播客和专家的见解
          </p>
          
          {/* Question input section */}
          <div className="w-full max-w-4xl">
            <form onSubmit={handleQuestionSubmit} className="relative">
              <div className="relative flex items-center">
                <SearchIcon className="absolute left-4 h-5 w-5 text-gray-400" />
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="询问任何关于人工智能的问题..."
                  className="w-full pl-12 pr-20 py-7 h-20 text-lg rounded-full border border-gray-200 focus:border-blue-500 shadow-sm"
                />
                <div className="absolute right-3 flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-gray-100"
                    title="语音输入"
                  >
                    <MicIcon className="h-5 w-5 text-gray-500" />
                  </Button>
                  <Button
                    type="submit"
                    className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600"
                    disabled={!question.trim()}
                  >
                    <ArrowRightIcon className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            </form>
            
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm" className="rounded-full bg-white text-sm">
                物理 AI 时代离我们有多远
              </Button>
              <Button variant="outline" size="sm" className="rounded-full bg-white text-sm">
                NotebookLM 脑图
              </Button>
              <Button variant="outline" size="sm" className="rounded-full bg-white text-sm">
                MCP 和 AI 工具生态
              </Button>
              <Button variant="outline" size="sm" className="rounded-full bg-white text-sm">
                Agentic AI 和 'Just' AI
              </Button>
            </div>
          </div>
        </div>
        
        {/* Popular Experts Section - Now before podcasts */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-800">本周专家</h2>
            <Button variant="ghost" className="text-blue-500 hover:text-blue-700 text-sm">
              查看更多
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularExperts.map((expert) => (
              <Card key={expert.id} className="hover:shadow-sm transition-shadow border border-gray-100">
                <div className="p-3">
                  <div className="flex gap-3 mb-3">
                    {/* Left side - Avatar and expert info */}
                    <div className="w-2/5">
                      <div className="flex items-start space-x-2">
                        <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                          {expert.avatar ? (
                            <img 
                              src={expert.avatar} 
                              alt={expert.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // If avatar doesn't exist, use a random fallback SVG avatar
                                (e.target as HTMLImageElement).src = getRandomAvatar();
                              }}
                            />
                          ) : (
                            <span className="text-gray-500">头像</span>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base">{expert.name}</CardTitle>
                          <CardDescription className="text-xs mb-2">{expert.expertise}</CardDescription>
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <ClockIcon className="h-3 w-3 mr-1" /> 
                            <span>活跃度: {expert.engagement}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Quote */}
                    <div className="w-3/5 text-xs italic bg-gray-50 p-2 rounded-md border-l-2 border-blue-400 flex items-center">
                      "{expert.quote}"
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full text-xs py-1 h-7">查看回答</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Recommended Podcasts Section - Now after experts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-800">本周推荐播客</h2>
            <Button variant="ghost" className="text-blue-500 hover:text-blue-700 text-sm">
              查看更多
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {updatedPodcasts.map((podcast) => (
              <Card key={podcast.id} className="overflow-hidden hover:shadow-sm transition-shadow border border-gray-100">
                <div className="relative h-36 bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <img 
                      src={`https://picsum.photos/seed/${podcast.id}/300/150`} 
                      alt={podcast.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {podcast.trending && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs flex items-center">
                      <TrendingUpIcon className="h-3 w-3 mr-1" />
                      热门
                    </div>
                  )}
                </div>
                <CardHeader className="p-3 pb-1">
                  <CardTitle className="text-base line-clamp-1">{podcast.title}</CardTitle>
                  <CardDescription className="text-xs">主播: {podcast.host}</CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0 pb-1">
                  <p className="text-xs text-gray-500">共 {podcast.episodes} 期</p>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  <Button variant="outline" size="sm" className="w-full text-xs py-1 h-7">收听最新一期</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 