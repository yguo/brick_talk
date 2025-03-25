import fs from 'fs';
import path from 'path';
import { createPodcast } from './podcasts';
import { Podcast } from './podcasts';

interface FeedsData {
  trending_podcasts: Podcast[];
  popular_podcasts: Podcast[];
  featured_experts: any[];
  categories: any[];
}

/**
 * 从feeds.json导入数据到数据库
 */
export const importDataFromJson = async () => {
  try {
    // 读取feeds.json文件
    const filePath = path.join(process.cwd(), 'app/data/feeds.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const feedsData: FeedsData = JSON.parse(fileData);
    
    console.log('开始导入数据...');
    
    // 导入热门播客
    for (const podcast of feedsData.trending_podcasts) {
      try {
        await createPodcast(podcast);
        console.log(`成功导入播客: ${podcast.title}`);
      } catch (error) {
        console.error(`导入播客 ${podcast.title} 失败:`, error);
      }
    }
    
    // 导入热门播客
    for (const podcast of feedsData.popular_podcasts) {
      try {
        await createPodcast(podcast);
        console.log(`成功导入播客: ${podcast.title}`);
      } catch (error) {
        console.error(`导入播客 ${podcast.title} 失败:`, error);
      }
    }
    
    console.log('数据导入完成');
    return {
      success: true,
      trendingCount: feedsData.trending_podcasts.length,
      popularCount: feedsData.popular_podcasts.length,
    };
  } catch (error) {
    console.error('导入数据失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

// 如果直接运行这个文件，执行导入操作
if (require.main === module) {
  importDataFromJson()
    .then((result) => {
      console.log('导入结果:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('导入错误:', error);
      process.exit(1);
    });
} 