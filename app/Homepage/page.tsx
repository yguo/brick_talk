'use client';

import React from 'react';
import { SafeImage } from '@/components/SafeImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { useTrendingPodcasts, usePopularPodcasts } from '@/hooks/usePodcasts';
import { useFeaturedExperts } from '@/hooks/useExperts';
import { Expert } from '../types/expert';
import '../styles/theme.css';

const UserProfileSkeleton = () => (
  <div className="flex items-center gap-2">
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className="space-y-1">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
);

const PodcastCardSkeleton = () => (
  <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg bg-[var(--color-bg-primary)]">
    <div className="relative w-full h-48">
      <Skeleton className="absolute inset-0" />
      <div className="absolute top-2 left-2">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <div className="absolute top-2 right-2">
        <Skeleton className="w-12 h-6 rounded-md" />
      </div>
    </div>
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-full" />
    </div>
  </Card>
);

const PopularPodcastSkeleton = () => (
  <Card className="flex flex-col gap-3 p-3 bg-[var(--color-bg-primary)]">
    <Skeleton className="h-32 w-full rounded-lg" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  </Card>
);

const ExpertCardSkeleton = () => (
  <Card className="p-4 flex flex-col gap-3 bg-[var(--color-bg-primary)]">
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <Skeleton className="h-10 w-full" />
    <div className="flex items-center gap-2">
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-12" />
    </div>
  </Card>
);

const HomePage = () => {
  const { podcasts: trendingPodcasts, isLoading: trendingLoading, error: trendingError } = useTrendingPodcasts();
  const { podcasts: popularPodcasts, isLoading: popularLoading, error: popularError } = usePopularPodcasts();
  const { experts, isLoading: expertsLoading, error: expertsError } = useFeaturedExperts();

  // 添加用户资料加载状态
  const isUserLoading = false; // 这里可以替换为实际的用户数据加载状态

  if (trendingError || popularError || expertsError) return <div>Error loading data</div>;

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)] flex">
      {/* 左侧导航栏 */}
      <aside className="w-16 bg-[var(--color-bg-primary)] shadow-sm flex flex-col items-center py-4 fixed h-full">
        <div className="flex flex-col gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-[var(--color-bg-tertiary)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>收藏</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-[var(--color-bg-tertiary)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11a9 9 0 0 1 9 9"></path>
                  <path d="M4 4a16 16 0 0 1 16 16"></path>
                  <circle cx="5" cy="19" r="1"></circle>
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>订阅</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-[var(--color-bg-tertiary)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>设置</TooltipContent>
          </Tooltip>
        </div>
      </aside>

      <div className="flex-1 ml-16">
        {/* 顶部导航栏 */}
        <header className="bg-[var(--color-bg-primary)] p-4 shadow-sm">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="13" stroke="black" strokeWidth="2"/>
                <path d="M11 8V20L20 14L11 8Z" fill="black"/>
              </svg>
              <span className="text-lg text-[var(--color-text-primary)]">砖家说Pro</span>
            </div>
            
            <div className="relative w-1/3">
              <Input 
                type="search" 
                placeholder="搜索内容..." 
                className="pl-10 pr-4 py-1.5 rounded-full text-sm border-[var(--color-border)] bg-[var(--color-bg-tertiary)]"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-sm text-[var(--color-text-secondary)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                收藏
              </Button>
              {isUserLoading ? (
                <UserProfileSkeleton />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                    <SafeImage 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" 
                      alt="用户头像" 
                      width={32} 
                      height={32} 
                    />
                  </div>
                  <div className="text-sm">
                    <div className="text-[var(--color-text-primary)]">李明</div>
                    <div className="text-[var(--color-text-tertiary)] text-xs">liming@gmail.com</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 主要内容 */}
        <main className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-normal mb-8 text-[var(--color-text-primary)]">砖家抛出的砖，你来捡...</h1>
          
          {/* 本周热门 */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-normal text-[var(--color-text-primary)]">本周抛出的砖</h2>
              <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)]">
                查看更多
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trendingLoading ? (
                Array(6).fill(0).map((_, i) => <PodcastCardSkeleton key={i} />)
              ) : (
                trendingPodcasts.map(podcast => (
                  <Card key={podcast.id} className="flex flex-col md:flex-row gap-4 p-4 transition-all duration-300 hover:shadow-lg bg-[var(--color-bg-primary)] border-[var(--color-border)]">
                    {/* 左侧：封面图片和播放器 */}
                    <div className="flex flex-col items-center gap-2 w-full md:w-32">
                      <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                        <SafeImage 
                          src={podcast.cover} 
                          alt={`${podcast.title} 封面`} 
                          fill 
                          className="object-cover opacity-90" 
                        />
                      </div>
                      <Button variant="secondary" size="sm" className="w-full flex items-center gap-2 bg-[var(--color-bg-primary)]/80">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        <span className="text-xs">{podcast.duration}</span>
                      </Button>
                      <div className="w-full bg-yellow-100/30 px-2 py-1.5 rounded text-center">
                        <span className="text-xs font-medium" style={{ background: 'linear-gradient(120deg, #fef08a 0%, #fef08a 100%)', backgroundRepeat: 'no-repeat', backgroundSize: '100% 50%', backgroundPosition: '0 85%' }}>
                          {podcast.description.slice(0, 10)}...
                        </span>
                      </div>
                    </div>

                    {/* 右侧：内容和嘉宾信息 */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <h3 className="text-[var(--color-text-primary)] text-lg font-medium mb-1">{podcast.title}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="relative h-6 w-6 rounded-full overflow-hidden">
                            <SafeImage 
                              src={podcast.author.avatar}
                              alt={podcast.author.name} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <p className="text-[var(--color-text-secondary)] text-sm">{podcast.author.name}</p>
                          <span className="text-[var(--color-text-tertiary)] text-xs">· {podcast.author.title}</span>
                        </div>
                        <p className="text-[var(--color-text-secondary)] text-sm line-clamp-2">{podcast.description}</p>
                      </div>

                      {/* 嘉宾评论 */}
                      {podcast.experts && podcast.experts.map((expert, index) => (
                        <div key={index} className="mt-3 p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="relative h-8 w-8 rounded-full overflow-hidden">
                              <SafeImage 
                                src={expert.avatar}
                                alt={expert.name} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <div>
                              <p className="text-[var(--color-text-primary)] text-sm">{expert.name}</p>
                              <p className="text-[var(--color-text-tertiary)] text-xs">专家点评</p>
                            </div>
                          </div>
                          <p className="text-[var(--color-text-secondary)] text-sm">{expert.comment}</p>
                        </div>
                      ))}

                      {/* 播客数据 */}
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-[var(--color-text-tertiary)] text-xs flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          {podcast.stats.views}
                        </span>
                        <span className="text-[var(--color-text-tertiary)] text-xs flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                          {podcast.stats.likes}
                        </span>
                        <span className="text-[var(--color-text-tertiary)] text-xs flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                            <polyline points="16 6 12 2 8 6"></polyline>
                            <line x1="12" y1="2" x2="12" y2="15"></line>
                          </svg>
                          {podcast.stats.shares}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>
          
          {/* 专家推荐 */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-normal text-[var(--color-text-primary)]">专家推荐</h2>
              <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)]">
                查看更多
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {expertsLoading ? (
                Array(10).fill(0).map((_, i) => <ExpertCardSkeleton key={i} />)
              ) : (
                experts.map((expert) => (
                  <Card key={expert.id} className="p-4 flex flex-col gap-3 bg-[var(--color-bg-primary)] border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <SafeImage 
                          src={expert.avatar}
                          alt={expert.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-[var(--color-text-primary)]">{expert.name}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]">
                            {expert.podcastCount || 0} 期
                          </span>
                        </div>
                        <p className="text-[var(--color-text-tertiary)] text-xs">{expert.title}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">{expert.bio}</p>
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        {expert.stats?.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        {expert.stats?.likes || 0}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>
          
          {/* 其他热门播客 */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-normal text-[var(--color-text-primary)]">其他热门播客</h2>
              <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)]">
                查看更多
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {['全部', '独家', '新闻与政治', '音乐', '商业', '健康'].map((category) => (
                <Button key={category} variant="outline" size="sm" className="rounded-full text-xs border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  {category}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {popularLoading ? (
                Array(10).fill(0).map((_, i) => <PopularPodcastSkeleton key={i} />)
              ) : (
                popularPodcasts.map(podcast => (
                  <Card key={podcast.id} className="flex flex-col gap-3 p-3 transition-all duration-300 hover:shadow-lg bg-[var(--color-bg-primary)] border-[var(--color-border)]">
                    <div className="relative h-32 w-full rounded-lg overflow-hidden flex-shrink-0">
                      <SafeImage 
                        src={podcast.cover} 
                        alt={`${podcast.title} 封面`} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-normal mb-1 text-[var(--color-text-primary)] line-clamp-1">{podcast.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="relative h-5 w-5 rounded-full overflow-hidden">
                          <SafeImage 
                            src={podcast.author.avatar}
                            alt={podcast.author.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <p className="text-[var(--color-text-tertiary)] text-xs line-clamp-1">{podcast.author.name}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </Button>
                        <span className="text-xs text-[var(--color-text-tertiary)]">{podcast.duration}</span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>

          {/* 金句部分 - 在小屏幕上隐藏 */}
          <section className="mb-12 hidden md:block">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-normal text-[var(--color-text-primary)]">今日金句</h2>
              <Button variant="ghost" size="sm" className="text-[var(--color-text-secondary)]">
                查看更多
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 金句内容 */}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HomePage; 