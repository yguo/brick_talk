#!/bin/bash

# 确保脚本在错误时停止执行
set -e

echo "正在设置 AI 播客网站项目..."

# 创建必要的目录
echo "创建数据库目录..."
mkdir -p app/lib/db/data

# 安装依赖
echo "安装依赖..."
pnpm install

# 确保数据库目录存在
if [ ! -f app/lib/db/data/podcasts.db ]; then
  echo "初始化数据库..."
  # 启动项目会自动创建数据库结构
  pnpm dev &
  PID=$!
  
  # 等待服务器启动
  echo "等待服务器启动..."
  sleep 5
  
  # 导入数据
  echo "尝试导入初始数据..."
  curl -X POST http://localhost:3000/api/import || echo "导入数据失败，请在应用启动后手动导入"
  
  # 关闭服务器
  kill $PID
else
  echo "数据库已存在，跳过初始化..."
fi

echo "设置完成！"
echo "使用 'pnpm dev' 启动开发服务器"
echo "访问 http://localhost:3000 查看网站"
echo "访问 http://localhost:3000/admin 进入管理界面" 