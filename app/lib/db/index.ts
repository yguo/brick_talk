import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// 确保数据库目录存在
const dbDir = path.join(process.cwd(), 'app/lib/db/data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 数据库文件路径
const dbPath = path.join(dbDir, 'podcasts.db');

// 创建数据库连接
const db = new Database(dbPath);

// 启用外键约束
db.pragma('foreign_keys = ON');

// 初始化数据库
const initDb = () => {
  // 检查表是否已存在
  const tableExists = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='podcasts'")
    .get();

  if (!tableExists) {
    // 创建播客表
    db.prepare(`
      CREATE TABLE IF NOT EXISTS podcasts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        duration TEXT NOT NULL,
        type TEXT NOT NULL,
        publishedAt TEXT NOT NULL,
        cover TEXT NOT NULL,
        description TEXT NOT NULL,
        url TEXT NOT NULL,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0,
        author_name TEXT NOT NULL,
        author_title TEXT NOT NULL,
        author_avatar TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 创建标签表
    db.prepare(`
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )
    `).run();

    // 创建播客-标签关联表
    db.prepare(`
      CREATE TABLE IF NOT EXISTS podcast_tags (
        podcast_id TEXT NOT NULL,
        tag_id INTEGER NOT NULL,
        PRIMARY KEY (podcast_id, tag_id),
        FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
      )
    `).run();

    // 创建专家表
    db.prepare(`
      CREATE TABLE IF NOT EXISTS experts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        avatar TEXT NOT NULL
      )
    `).run();

    // 创建专家评论表
    db.prepare(`
      CREATE TABLE IF NOT EXISTS expert_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        podcast_id TEXT NOT NULL,
        expert_id INTEGER NOT NULL,
        comment TEXT NOT NULL,
        FOREIGN KEY (podcast_id) REFERENCES podcasts(id) ON DELETE CASCADE,
        FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE CASCADE
      )
    `).run();

    console.log('数据库初始化完成');
  }
};

// 执行初始化
initDb();

export default db; 