# 后端工程开发指导（Guideline）

## 一、FastAPI 后端 API 设计

### 1. API结构与路由规划

API统一采用RESTful风格：

```
api/
│── posts/
│   ├── GET    /api/posts              # 获取文章列表
│   ├── GET /posts/{id}            # 获取指定文章详情
│   ├── POST /posts               # 创建新文章 (需认证)
│   ├── PUT /posts/{id}          # 更新文章（需权限）
│   ├── DELETE /posts/{id}       # 删除文章（管理员）
│── users/
│   ├── POST /users/register     # 用户注册
│   ├── POST /users/login        # 用户登录 (JWT认证)
│   ├── GET /users/me            # 获取个人信息
│── admin/
│   ├── GET /admin/stats         # 管理后台概览
│── cache/
│   ├── GET /cache/flush         # 缓存清理（管理员）
```

### 2. 数据模型设计（Pydantic & SQLAlchemy）

- **请求/响应数据模型（Pydantic）**

```python
from pydantic import BaseModel

class PostCreate(BaseModel):
    title: str
    content: str
    author_id: int
    published: bool = True

class PostRead(PostCreate):
    id: int
    class Config:
        orm_mode = True
```

- **数据库ORM模型（SQLAlchemy）**

```python
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    content = Column(Text)
    author_id = Column(Integer, ForeignKey("users.id"))
    published = Column(Boolean, default=True)
```

### 2. 数据库交互与依赖注入管理

- 使用`SQLAlchemy`处理数据库ORM交互
- 统一依赖管理Session：

```python
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
from database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/posts")
def read_posts(db: Session = Depends(get_db)):
    return db.query(Post).all()
```

### 3. 缓存策略（Redis）

- Redis作为缓存层，减少数据库压力：

```python
import redis

redis_client = redis.Redis(host='localhost', port=6379)

@app.get("/posts")
def cached_posts(db: Session = Depends(get_db)):
    cache_key = "posts:all"
    cached_posts = redis_client.get(cache_key)
    if cached_posts:
        return json.loads(cached_posts)
    posts = db.query(Post).all()
    redis_client.set("posts_cache", json.dumps(posts), ex=300)  # 5分钟过期
    return posts
```

### 4. 异步任务调度（Celery + Redis）

- 使用Celery执行后台异步任务：

```python
from celery import Celery

celery_app = Celery(
    "worker",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0"
)

@celery_app.task
def run_crawler():
    # 调用爬虫任务
```

### 5. API认证与权限管理

- 使用JWT进行认证，推荐 OAuth2密码模式：
```python
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

@app.get("/users/me")
def read_users_me(token: str = Depends(oauth2_scheme)):
    user = decode_token(token)
    return user
```

### 6. 日志与错误处理

- 使用内置日志记录关键事件和异常，方便问题追溯：
```python
import logging

logger = logging.getLogger("uvicorn")

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unexpected error: {exc}")
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
```

---

## 二、Next.js SSR与数据获取策略

### 1. Next.js页面数据获取

- SSR方式获取数据示例：
```tsx
export async function getServerSideProps(context) {
    const res = await fetch("http://fastapi-service/api/posts");
    const posts = await res.json();
    return { props: { posts } };
}
```

### 2. 数据缓存策略 (SWR)
使用 `SWR` 缓存数据并自动刷新：

```typescript
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(r => r.json());

const { data: posts, error } = useSWR("/api/posts", fetcher);
```

---

## 三、后端工程开发规范

### 1. 目录结构示例

```
backend/
├── app/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── routes/
│   │   ├── posts.py
│   │   └── users.py
│   ├── database.py
│── tests/
│   ├── test_routes.py
```

### 3.2 代码风格与最佳实践
- 使用Black统一格式化代码
- 代码清晰易读，避免长函数（超过50行须拆分）
- 函数功能单一明确，避免副作用
- 所有API端点处理异常（try-except）

### 3.3 测试与部署（CI/CD）
- 使用 Pytest 编写单元测试
- Docker 容器化部署，Dockerfile示例：
```Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . /app
RUN pip install --upgrade pip && pip install -r requirements.txt
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- GitHub Actions CI/CD流水线示例：

```yaml
name: CI/CD Pipeline
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run Tests
        run: pytest
```

---

## 附录：参考链接与资源

### FastAPI官方文档
- [FastAPI官方文档](https://fastapi.tiangolo.com/)
- [FastAPI SQLAlchemy 示例](https://fastapi.tiangolo.com/tutorial/sql-databases/)
- [FastAPI OAuth2 JWT实现](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)
- [FastAPI依赖注入](https://fastapi.tiangolo.com/tutorial/dependencies/)
- [Celery + FastAPI 异步任务实现](https://fastapi.tiangolo.com/project-generation/#celery-and-redis)

### Next.js SSR 官方文档
- [Next.js数据获取策略](https://nextjs.org/docs/basic-features/data-fetching/overview)
- [Next.js + SWR 数据缓存策略](https://swr.vercel.app/docs/getting-started)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

### 其他推荐工具与实践
- [Docker官方教程](https://docs.docker.com/get-started/)
- [Github Actions快速上手](https://docs.github.com/actions)
- [SQLAlchemy官方文档](https://docs.sqlalchemy.org/en/20/)
- [Redis官方文档](https://redis.io/docs/getting-started/)
- [Pydantic 使用指南](https://docs.pydantic.dev/latest/)
- [React与SWR数据请求指南](https://swr.vercel.app/zh-CN)

---
