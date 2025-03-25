# AI 播客网站

这是一个专门用于AI技术领域的播客内容管理和展示平台，提供最新的AI行业动态、研究、应用和见解。

## 功能特点

- 🎙️ 播客内容管理：添加、编辑、删除播客
- 👨‍💼 专家观点收集：每期播客包含行业专家的评论和见解
- 🔍 内容搜索：按标题、标签或内容搜索播客
- 📊 数据统计：跟踪播客的浏览量、点赞和分享数据
- 🗂️ 分类管理：按主题对播客进行分类

## 技术栈

- **前端**：Next.js 14, React, TypeScript, Tailwind CSS
- **后端**：Next.js API Routes, SQLite
- **状态管理**：React Hooks
- **样式**：Tailwind CSS, Shadcn UI组件

## 安装步骤

1. 克隆仓库
   ```bash
   git clone [仓库URL]
   cd AI_podcast2
   ```

2. 安装依赖
   ```bash
   pnpm install
   ```

3. 启动开发服务器
   ```bash
   pnpm dev
   ```

4. 导入初始数据（首次运行）
   - 访问 `http://localhost:3000/admin`
   - 点击"导入数据"按钮

## 项目结构

```
AI_podcast2/
├── app/                  # Next.js 应用目录
│   ├── admin/            # 管理界面
│   ├── api/              # API路由
│   ├── Homepage/         # 首页
│   ├── components/       # 共享组件
│   ├── data/             # 静态数据
│   ├── hooks/            # 自定义React Hooks
│   ├── lib/              # 工具函数和API
│   │   ├── api.ts        # 前端API函数
│   │   └── db/           # 数据库相关代码
│   │       ├── data/     # 数据库文件（git忽略）
│   │       ├── index.ts  # 数据库初始化
│   │       └── podcasts.ts # 播客CRUD操作
│   ├── styles/           # 全局样式
│   └── types/            # TypeScript类型定义
├── public/               # 静态资源
└── ...
```

## 数据库说明

项目使用SQLite作为数据库，首次运行需导入初始数据。数据库文件会自动创建在 `app/lib/db/data/` 目录下，但不会被纳入版本控制。

## 贡献指南

1. 创建功能分支 (`git checkout -b feature/amazing-feature`)
2. 提交更改 (`git commit -m 'Add some amazing feature'`)
3. 推送到分支 (`git push origin feature/amazing-feature`)
4. 创建Pull Request

## 许可证

[MIT](LICENSE) 