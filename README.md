# Brick Talk

一个基于 Next.js 构建的专家访谈平台，提供技术大咖访谈、知识分享和行业见解。

## 技术栈

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Shadcn/ui
- pnpm

## 功能特点

- 响应式设计，支持多端适配
- 专家推荐系统
- 播客内容展示
- 用户互动功能
- 主题切换

## 本地开发

1. 克隆项目

```bash
git clone [your-repository-url]
cd brick_talk
```

2. 安装依赖

```bash
pnpm install
```

3. 启动开发服务器

```bash
pnpm dev
```

4. 打开浏览器访问 http://localhost:3000

## 项目结构

```
brick_talk/
├── app/                    # Next.js 应用目录
│   ├── components/        # React 组件
│   ├── hooks/            # 自定义 Hooks
│   ├── types/            # TypeScript 类型定义
│   ├── data/             # 静态数据
│   └── styles/           # 样式文件
├── public/               # 静态资源
│   └── avatars/         # 头像资源
└── package.json         # 项目配置
```

## 贡献指南

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT 