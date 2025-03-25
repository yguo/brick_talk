import db from './index';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

// 定义播客模式验证
export const PodcastSchema = z.object({
  id: z.string().optional(), // 新增时自动生成
  title: z.string().min(1, '标题不能为空'),
  duration: z.string().min(1, '时长不能为空'),
  type: z.enum(['audio', 'video']),
  publishedAt: z.string().datetime(),
  // 放宽封面URL验证，允许相对路径
  cover: z.string().min(1, '封面图片不能为空'),
  description: z.string().min(1, '描述不能为空'),
  // 放宽媒体URL验证，允许相对路径
  url: z.string().min(1, 'URL不能为空'),
  author: z.object({
    name: z.string().min(1, '作者姓名不能为空'),
    title: z.string().min(1, '作者头衔不能为空'),
    avatar: z.string().min(1, '作者头像不能为空'),
  }),
  tags: z.array(z.string()).default([]),
  experts: z.array(
    z.object({
      name: z.string().min(1, '专家姓名不能为空'),
      avatar: z.string().min(1, '专家头像不能为空'),
      comment: z.string().optional(),
    })
  ).default([]),
  stats: z.object({
    views: z.number().nonnegative().default(0),
    likes: z.number().nonnegative().default(0),
    shares: z.number().nonnegative().default(0),
  }).default({ views: 0, likes: 0, shares: 0 }),
});

export type Podcast = z.infer<typeof PodcastSchema>;

// 定义数据库记录类型
interface PodcastRecord {
  id: string;
  title: string;
  duration: string;
  type: string;
  publishedAt: string;
  cover: string;
  description: string;
  url: string;
  views: number;
  likes: number;
  shares: number;
  author_name: string;
  author_title: string;
  author_avatar: string;
  created_at?: string;
  updated_at?: string;
}

interface TagRecord {
  name: string;
}

interface ExpertCommentRecord {
  name: string;
  avatar: string;
  comment: string;
}

// 查询所有播客
export const getAllPodcasts = () => {
  try {
    const podcasts = db.prepare('SELECT * FROM podcasts ORDER BY publishedAt DESC').all() as PodcastRecord[];
    
    // 为每个播客添加标签和专家评论
    return podcasts.map((podcast: PodcastRecord) => {
      const tagsResult = db.prepare(`
        SELECT t.name FROM tags t
        JOIN podcast_tags pt ON t.id = pt.tag_id
        WHERE pt.podcast_id = ?
      `).all(podcast.id) as { name: string }[];
      
      const tags = tagsResult.map(tag => tag.name);
      
      const experts = db.prepare(`
        SELECT e.name, e.avatar, ec.comment 
        FROM experts e
        JOIN expert_comments ec ON e.id = ec.expert_id
        WHERE ec.podcast_id = ?
      `).all(podcast.id) as ExpertCommentRecord[];
      
      return {
        id: podcast.id,
        title: podcast.title,
        duration: podcast.duration,
        type: podcast.type,
        publishedAt: podcast.publishedAt,
        cover: podcast.cover,
        description: podcast.description,
        url: podcast.url,
        author: {
          name: podcast.author_name,
          title: podcast.author_title,
          avatar: podcast.author_avatar,
        },
        tags,
        experts,
        stats: {
          views: podcast.views,
          likes: podcast.likes,
          shares: podcast.shares,
        },
      };
    });
  } catch (error) {
    console.error('获取播客列表失败:', error);
    return [];
  }
};

// 根据ID获取播客
export const getPodcastById = (id: string) => {
  try {
    const podcast = db.prepare('SELECT * FROM podcasts WHERE id = ?').get(id) as PodcastRecord | undefined;
    
    if (!podcast) {
      return null;
    }
    
    const tagsResult = db.prepare(`
      SELECT t.name FROM tags t
      JOIN podcast_tags pt ON t.id = pt.tag_id
      WHERE pt.podcast_id = ?
    `).all(podcast.id) as { name: string }[];
    
    const tags = tagsResult.map(tag => tag.name);
    
    const experts = db.prepare(`
      SELECT e.name, e.avatar, ec.comment 
      FROM experts e
      JOIN expert_comments ec ON e.id = ec.expert_id
      WHERE ec.podcast_id = ?
    `).all(podcast.id) as ExpertCommentRecord[];
    
    return {
      id: podcast.id,
      title: podcast.title,
      duration: podcast.duration,
      type: podcast.type,
      publishedAt: podcast.publishedAt,
      cover: podcast.cover,
      description: podcast.description,
      url: podcast.url,
      author: {
        name: podcast.author_name,
        title: podcast.author_title,
        avatar: podcast.author_avatar,
      },
      tags,
      experts,
      stats: {
        views: podcast.views,
        likes: podcast.likes,
        shares: podcast.shares,
      },
    };
  } catch (error) {
    console.error(`获取播客 ${id} 失败:`, error);
    return null;
  }
};

// 创建播客
export const createPodcast = (data: Podcast) => {
  // 验证数据
  const result = PodcastSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`数据验证失败: ${JSON.stringify(result.error.format())}`);
  }
  
  const podcast = result.data;
  const id = podcast.id || uuidv4();
  
  try {
    db.transaction(() => {
      // 插入播客基本信息
      db.prepare(`
        INSERT INTO podcasts (
          id, title, duration, type, publishedAt, cover, description, url,
          views, likes, shares, author_name, author_title, author_avatar
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        podcast.title,
        podcast.duration,
        podcast.type,
        podcast.publishedAt,
        podcast.cover,
        podcast.description,
        podcast.url,
        podcast.stats.views,
        podcast.stats.likes,
        podcast.stats.shares,
        podcast.author.name,
        podcast.author.title,
        podcast.author.avatar
      );
      
      // 处理标签
      if (podcast.tags && podcast.tags.length > 0) {
        const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
        const linkTagToPodcast = db.prepare(`
          INSERT INTO podcast_tags (podcast_id, tag_id)
          SELECT ?, id FROM tags WHERE name = ?
        `);
        
        podcast.tags.forEach(tagName => {
          insertTag.run(tagName);
          linkTagToPodcast.run(id, tagName);
        });
      }
      
      // 处理专家评论
      if (podcast.experts && podcast.experts.length > 0) {
        const insertExpert = db.prepare('INSERT OR IGNORE INTO experts (name, avatar) VALUES (?, ?)');
        const getExpertId = db.prepare('SELECT id FROM experts WHERE name = ? AND avatar = ?');
        const insertComment = db.prepare(`
          INSERT INTO expert_comments (podcast_id, expert_id, comment)
          VALUES (?, ?, ?)
        `);
        
        podcast.experts.forEach(expert => {
          insertExpert.run(expert.name, expert.avatar);
          const expertRecord = getExpertId.get(expert.name, expert.avatar) as { id: number } | undefined;
          
          if (expertRecord) {
            // 即使 comment 为空，也插入记录，使用空字符串替代
            insertComment.run(id, expertRecord.id, expert.comment || '');
          }
        });
      }
    })();
    
    return getPodcastById(id);
  } catch (error) {
    console.error('创建播客失败:', error);
    throw error;
  }
};

// 更新播客
export const updatePodcast = (id: string, data: Partial<Podcast>) => {
  try {
    const existingPodcast = getPodcastById(id);
    
    if (!existingPodcast) {
      throw new Error(`播客 ${id} 不存在`);
    }
    
    // 合并现有数据和更新数据
    const mergedData = {
      ...existingPodcast,
      ...data,
      author: {
        ...existingPodcast.author,
        ...(data.author || {}),
      },
      stats: {
        ...existingPodcast.stats,
        ...(data.stats || {}),
      },
    };
    
    // 验证合并后的数据
    const result = PodcastSchema.safeParse(mergedData);
    if (!result.success) {
      throw new Error(`数据验证失败: ${JSON.stringify(result.error.format())}`);
    }
    
    const podcast = result.data;
    
    db.transaction(() => {
      // 更新播客基本信息
      db.prepare(`
        UPDATE podcasts SET
          title = ?,
          duration = ?,
          type = ?,
          publishedAt = ?,
          cover = ?,
          description = ?,
          url = ?,
          views = ?,
          likes = ?,
          shares = ?,
          author_name = ?,
          author_title = ?,
          author_avatar = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        podcast.title,
        podcast.duration,
        podcast.type,
        podcast.publishedAt,
        podcast.cover,
        podcast.description,
        podcast.url,
        podcast.stats.views,
        podcast.stats.likes,
        podcast.stats.shares,
        podcast.author.name,
        podcast.author.title,
        podcast.author.avatar,
        id
      );
      
      // 如果提供了新标签，则更新标签
      if (data.tags) {
        // 删除旧的标签关联
        db.prepare('DELETE FROM podcast_tags WHERE podcast_id = ?').run(id);
        
        // 添加新的标签关联
        const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
        const linkTagToPodcast = db.prepare(`
          INSERT INTO podcast_tags (podcast_id, tag_id)
          SELECT ?, id FROM tags WHERE name = ?
        `);
        
        podcast.tags.forEach(tagName => {
          insertTag.run(tagName);
          linkTagToPodcast.run(id, tagName);
        });
      }
      
      // 如果提供了新专家评论，则更新专家评论
      if (data.experts) {
        // 删除旧的专家评论
        db.prepare('DELETE FROM expert_comments WHERE podcast_id = ?').run(id);
        
        // 添加新的专家评论
        const insertExpert = db.prepare('INSERT OR IGNORE INTO experts (name, avatar) VALUES (?, ?)');
        const getExpertId = db.prepare('SELECT id FROM experts WHERE name = ? AND avatar = ?');
        const insertComment = db.prepare(`
          INSERT INTO expert_comments (podcast_id, expert_id, comment)
          VALUES (?, ?, ?)
        `);
        
        podcast.experts.forEach(expert => {
          insertExpert.run(expert.name, expert.avatar);
          const expertRecord = getExpertId.get(expert.name, expert.avatar) as { id: number } | undefined;
          
          if (expertRecord) {
            // 即使 comment 为空，也插入记录，使用空字符串替代
            insertComment.run(id, expertRecord.id, expert.comment || '');
          }
        });
      }
    })();
    
    return getPodcastById(id);
  } catch (error) {
    console.error(`更新播客 ${id} 失败:`, error);
    throw error;
  }
};

// 删除播客
export const deletePodcast = (id: string) => {
  try {
    const podcast = getPodcastById(id);
    
    if (!podcast) {
      throw new Error(`播客 ${id} 不存在`);
    }
    
    // 由于设置了外键约束，删除播客时会自动删除关联的标签和专家评论
    db.prepare('DELETE FROM podcasts WHERE id = ?').run(id);
    
    return true;
  } catch (error) {
    console.error(`删除播客 ${id} 失败:`, error);
    throw error;
  }
};