# AI 播客网站前端开发指南

本文档为AI播客网站前端开发团队提供详细的开发指导，包括技术栈选择、代码规范、架构设计、性能优化和协作流程等方面的最佳实践。

## 1. 技术栈概览

### 1.1 核心技术

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript 5.0+
- **UI库**: Chakra UI
- **状态管理**: React Context + SWR
- **构建工具**: Webpack (Next.js内置)
- **包管理器**: pnpm
- **代码质量**: ESLint + Prettier
- **测试工具**: Jest + React Testing Library
- **API通信**: Axios + React Query

### 1.2 技术选择理由

- **Next.js**: 提供SSR/SSG支持，改善SEO和首屏加载性能；内置路由系统和API路由
- **TypeScript**: 提供类型安全，减少运行时错误，提高代码可维护性
- **Chakra UI**: 提供可访问性支持、响应式设计和主题定制能力
- **SWR**: 轻量级数据获取库，提供缓存、重新验证、焦点追踪等功能
- **pnpm**: 比npm和yarn更高效的包管理器，节省磁盘空间和安装时间

## 2. 项目结构

```
src/
├── app/                  # Next.js App Router结构
│   ├── (auth)/           # 认证相关路由分组
│   ├── (main)/           # 主要内容路由分组
│   ├── api/              # API路由
│   └── layout.tsx        # 根布局组件
├── components/           # 共享组件
│   ├── common/           # 通用UI组件
│   ├── features/         # 功能组件
│   ├── layouts/          # 布局组件
│   └── player/           # 播客播放器组件
├── hooks/                # 自定义React Hooks
├── lib/                  # 工具函数和第三方库封装
│   ├── api/              # API客户端
│   ├── auth/             # 认证相关
│   └── utils/            # 通用工具函数
├── providers/            # 上下文提供者
│   ├── auth-provider.tsx # 认证上下文
│   └── theme-provider.tsx# 主题上下文
├── styles/               # 全局样式和主题配置
├── types/                # TypeScript类型定义
└── public/               # 静态资源
```

## 3. 组件设计原则

### 3.1 组件分类

- **页面组件**: 对应路由，负责数据获取和布局组织
- **功能组件**: 实现特定业务功能的复杂组件
- **UI组件**: 可复用的展示型组件，不包含业务逻辑
- **布局组件**: 负责页面结构和排版的组件
- **HOC/Provider**: 提供横切关注点的高阶组件和上下文提供者

### 3.2 组件设计规范

- **单一职责**: 每个组件只负责一个功能点
- **可组合性**: 优先使用组合而非继承
- **可测试性**: 组件设计应便于单元测试
- **可访问性**: 遵循WCAG 2.1 AA标准
- **响应式**: 所有组件应适配移动端到桌面端的各种屏幕尺寸

### 3.3 组件文件结构

```typescript
// 组件文件结构示例 (PodcastCard.tsx)

// 1. 导入
import { useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { usePodcastData } from '@/hooks/usePodcastData';

// 2. 类型定义
interface PodcastCardProps {
  id: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  duration?: number;
  onClick?: (id: string) => void;
}

// 3. 组件定义
export const PodcastCard: React.FC<PodcastCardProps> = ({
  id,
  title,
  summary,
  imageUrl,
  duration,
  onClick,
}) => {
  // 状态和钩子
  const [isHovered, setIsHovered] = useState(false);
  const { data } = usePodcastData(id);
  
  // 事件处理
  const handleClick = () => {
    if (onClick) onClick(id);
  };
  
  // 渲染
  return (
    <Box
      borderRadius="md"
      overflow="hidden"
      boxShadow={isHovered ? 'md' : 'sm'}
      transition="all 0.2s"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      cursor="pointer"
    >
      {/* 组件内容 */}
    </Box>
  );
};

// 4. 默认导出
export default PodcastCard;
```

## 4. 状态管理

### 4.1 状态分类

- **本地状态**: 使用`useState`和`useReducer`管理组件内部状态
- **共享状态**: 使用React Context管理跨组件状态
- **服务器状态**: 使用SWR管理API数据状态
- **URL状态**: 使用Next.js路由参数管理URL相关状态
- **表单状态**: 使用React Hook Form管理表单状态

### 4.2 状态管理最佳实践

```typescript
// Context示例 (PlayerContext.tsx)
import { createContext, useContext, useReducer, ReactNode } from 'react';

// 状态类型
interface PlayerState {
  isPlaying: boolean;
  currentPodcast: string | null;
  volume: number;
  progress: number;
}

// 动作类型
type PlayerAction = 
  | { type: 'PLAY'; podcastId: string }
  | { type: 'PAUSE' }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'SET_PROGRESS'; progress: number };

// 初始状态
const initialState: PlayerState = {
  isPlaying: false,
  currentPodcast: null,
  volume: 0.8,
  progress: 0,
};

// Reducer函数
function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true, currentPodcast: action.podcastId };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'SET_VOLUME':
      return { ...state, volume: action.volume };
    case 'SET_PROGRESS':
      return { ...state, progress: action.progress };
    default:
      return state;
  }
}

// 创建Context
const PlayerContext = createContext<{
  state: PlayerState;
  dispatch: React.Dispatch<PlayerAction>;
} | undefined>(undefined);

// Provider组件
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  
  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
}

// 自定义Hook
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
```

## 5. API通信

### 5.1 API客户端配置

```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 处理401错误
    if (error.response?.status === 401) {
      // 清除token并重定向到登录页
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 5.2 数据获取Hooks

```typescript
// hooks/usePodcasts.ts
import useSWR from 'swr';
import apiClient from '@/lib/api/client';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

export function usePodcasts(page = 1, limit = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/podcasts?page=${page}&limit=${limit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    podcasts: data?.podcasts || [],
    totalPages: data?.totalPages || 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}
```

## 6. 路由与导航

### 6.1 Next.js App Router

- 使用Next.js 14+ App Router进行路由管理
- 路由文件命名规则：`page.tsx`为页面组件，`layout.tsx`为布局组件
- 使用路由分组`(groupName)`进行逻辑分组，不影响URL路径

### 6.2 导航最佳实践

```typescript
// 客户端导航
import { useRouter } from 'next/navigation';

export function PodcastListItem({ podcast }) {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/podcasts/${podcast.id}`);
  };
  
  return (
    <div onClick={handleClick}>
      {/* 内容 */}
    </div>
  );
}

// 链接组件
import Link from 'next/link';

export function Navigation() {
  return (
    <nav>
      <Link href="/">首页</Link>
      <Link href="/podcasts">播客列表</Link>
      <Link href="/about">关于我们</Link>
    </nav>
  );
}
```

## 7. 样式与主题

### 7.1 Chakra UI主题配置

```typescript
// styles/theme.ts
import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ...其他色阶
    900: '#0c4a6e',
  },
  accent: {
    // 辅助色系
  },
};

const fonts = {
  heading: '"PingFang SC", "Microsoft YaHei", sans-serif',
  body: '"PingFang SC", "Microsoft YaHei", sans-serif',
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
    },
    variants: {
      primary: {
        bg: 'brand.600',
        color: 'white',
        _hover: { bg: 'brand.700' },
      },
      // 其他变体
    },
  },
  // 其他组件样式
};

const theme = extendTheme({
  colors,
  fonts,
  components,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
});

export default theme;
```

### 7.2 响应式设计

- 使用Chakra UI的响应式属性进行断点设计
- 移动优先的设计理念
- 常用断点：sm(480px), md(768px), lg(992px), xl(1280px)

```typescript
// 响应式设计示例
<Box
  padding={{ base: '4', md: '6', lg: '8' }}
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
  display={{ base: 'block', md: 'flex' }}
>
  {/* 内容 */}
</Box>
```

## 8. 性能优化

### 8.1 代码分割与懒加载

- 使用Next.js的动态导入进行代码分割
- 对大型组件和不常用组件进行懒加载

```typescript
// 动态导入示例
import dynamic from 'next/dynamic';

const DynamicPodcastPlayer = dynamic(
  () => import('@/components/player/PodcastPlayer'),
  {
    loading: () => <p>加载中...</p>,
    ssr: false, // 如果组件依赖浏览器API，设置为false
  }
);
```

### 8.2 图片优化

- 使用Next.js的Image组件进行图片优化
- 实现响应式图片和延迟加载

```typescript
import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/images/podcast-cover.jpg"
      alt="播客封面"
      width={300}
      height={300}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      priority={false} // 非首屏图片设为false
    />
  );
}
```

### 8.3 Web Vitals监控

- 实现Core Web Vitals监控
- 使用Next.js内置的性能分析工具

```typescript
// app/layout.tsx
export function reportWebVitals(metric) {
  // 发送到分析服务
  console.log(metric);
}
```

## 9. 测试策略

### 9.1 单元测试

- 使用Jest和React Testing Library进行组件测试
- 测试文件命名：`ComponentName.test.tsx`
- 测试覆盖率目标：70%+

```typescript
// PodcastCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import PodcastCard from './PodcastCard';

describe('PodcastCard', () => {
  const mockProps = {
    id: '123',
    title: '测试播客',
    summary: '这是一个测试播客',
  };
  
  it('renders podcast title and summary', () => {
    render(<PodcastCard {...mockProps} />);
    
    expect(screen.getByText('测试播客')).toBeInTheDocument();
    expect(screen.getByText('这是一个测试播客')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<PodcastCard {...mockProps} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('测试播客'));
    expect(handleClick).toHaveBeenCalledWith('123');
  });
});
```

### 9.2 集成测试

- 使用Cypress进行端到端测试
- 关注核心用户流程和关键功能

```typescript
// cypress/e2e/podcast-playback.cy.js
describe('Podcast Playback', () => {
  beforeEach(() => {
    cy.visit('/podcasts/123');
  });
  
  it('should play podcast when play button is clicked', () => {
    cy.get('[data-testid="play-button"]').click();
    cy.get('[data-testid="player"]').should('have.attr', 'data-playing', 'true');
  });
  
  it('should update progress bar during playback', () => {
    cy.get('[data-testid="play-button"]').click();
    // 等待5秒
    cy.wait(5000);
    cy.get('[data-testid="progress-bar"]')
      .should('have.attr', 'value')
      .and('be.greaterThan', 0);
  });
});
```

## 10. 无障碍性

### 10.1 无障碍标准

- 遵循WCAG 2.1 AA标准
- 支持键盘导航
- 提供适当的ARIA属性
- 确保足够的颜色对比度

### 10.2 无障碍实践

```typescript
// 无障碍按钮示例
import { Button } from '@chakra-ui/react';

export function AccessibleButton() {
  return (
    <Button
      aria-label="播放播客"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          // 处理点击
        }
      }}
    >
      <Icon name="play" />
    </Button>
  );
}
```

## 11. 国际化与本地化

### 11.1 多语言支持

- 使用next-intl进行国际化
- 支持中英文切换
- 提取所有UI文本到语言文件

```typescript
// messages/zh.json
{
  "common": {
    "play": "播放",
    "pause": "暂停",
    "next": "下一个",
    "previous": "上一个"
  },
  "podcast": {
    "relatedTitle": "相关播客",
    "publishedAt": "发布于 {date}"
  }
}

// 使用示例
import { useTranslations } from 'next-intl';

export function PlayerControls() {
  const t = useTranslations('common');
  
  return (
    <div>
      <button>{t('play')}</button>
      <button>{t('pause')}</button>
    </div>
  );
}
```

## 12. 错误处理

### 12.1 全局错误边界

```typescript
// components/common/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误到监控服务
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>出错了</h2>
          <p>请刷新页面或联系支持团队</p>
          <button onClick={() => this.setState({ hasError: false })}>
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

### 12.2 API错误处理

```typescript
// hooks/useApiMutation.ts
import { useState } from 'react';
import apiClient from '@/lib/api/client';

export function useApiMutation<T, R>(url: string) {
  const [data, setData] = useState<R | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (payload: T) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post<R>(url, payload);
      setData(response.data);
      return response.data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, data, error, isLoading };
}
```

## 13. 安全最佳实践

### 13.1 XSS防护

- 使用React的自动转义功能
- 对用户输入进行验证和清理
- 实现内容安全策略(CSP)

### 13.2 认证与授权

- 使用JWT进行API认证
- 实现CSRF保护
- 敏感操作二次确认

```typescript
// lib/auth/protectedRoute.tsx
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function withAuth<P>(Component: React.ComponentType<P>) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
      return <div>加载中...</div>;
    }

    if (!user) {
      router.replace('/login');
      return null;
    }

    return <Component {...props} />;
  };
}
```

## 14. 开发流程与规范

### 14.1 代码规范

- 使用ESLint和Prettier进行代码格式化
- 遵循TypeScript严格模式
- 使用Husky和lint-staged在提交前检查代码

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

### 14.2 Git工作流

- 使用Feature Branch工作流
- 提交信息遵循Conventional Commits规范
- 使用Pull Request进行代码审查
- 主分支保护，需要通过CI检查和代码审查才能合并

### 14.3 文档规范

- 组件文档：使用Storybook记录组件用法和变体
- API文档：使用JSDoc注释记录函数和组件接口
- 架构文档：使用Markdown记录系统架构和设计决策

## 15. 性能指标与监控

### 15.1 关键性能指标

- **FCP (First Contentful Paint)**: < 1.8s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTI (Time to Interactive)**: < 3.8s

### 15.2 前端监控

- 使用Sentry进行错误监控
- 使用Google Analytics进行用户行为分析
- 实现自定义性能指标收集

## 16. 总结

本前端开发指南旨在为AI播客网站项目提供清晰的技术方向和开发规范。通过采用Next.js、TypeScript和Chakra UI等现代技术栈，结合组件化设计、状态管理最佳实践和性能优化策略，我们能够构建一个高性能、可维护且用户友好的前端应用。

开发团队应当遵循本指南中的原则和实践，同时保持对新技术和最佳实践的关注，不断改进和优化前端架构和用户体验。 