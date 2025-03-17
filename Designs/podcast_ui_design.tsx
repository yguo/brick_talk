import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// 示例数据
const podcastItems = [
  {
    id: 1,
    title: "生成式AI模型的未来",
    summary: "生成式AI领域的最新进展展示了在创建类人内容方面的显著进步。本期节目探讨了GPT-4、Claude和Gemini等模型背后的技术创新，讨论它们的能力、局限性以及潜在的未来发展...",
    type: "text",
    tags: ["人工智能", "机器学习", "研究"],
    date: "2024-03-14",
    experts: [
      {
        name: "陈博士",
        avatar: "/avatars/sarah.png",
        comment: "关于参数效率的讨论特别有见地。我想补充的是，最近关于混合专家架构的研究表明，在不成比例增加计算资源的情况下扩展这些模型是可行的。"
      }
    ]
  },
  {
    id: 2,
    title: "AI监管：平衡创新与安全",
    summary: "随着AI系统变得越来越强大和普及，全球各国政府正在制定监管框架以确保负责任的发展。本期节目探讨了欧盟AI法案、美国AI行政命令以及其他全球倡议...",
    type: "audio",
    audioUrl: "/podcasts/ai-regulation.mp3",
    duration: "32:15",
    tags: ["政策", "监管", "伦理"],
    date: "2024-03-12",
    experts: [
      {
        name: "王教授",
        avatar: "/avatars/michael.png",
        comment: "欧盟和美国方法之间的比较突显了预防原则和创新优先思维之间的有趣张力。我认为最佳路径在两者之间，对高风险应用进行有针对性的监管，同时允许在低风险领域进行实验。"
      }
    ]
  },
  {
    id: 3,
    title: "开源AI：社区驱动的创新",
    summary: "开源AI运动随着Llama、Mistral和Falcon等模型的广泛可用而加速发展。本期节目探讨了开源如何使AI技术民主化并促进新应用的发展...",
    type: "video",
    videoUrl: "/videos/open-source-ai.mp4",
    thumbnail: "/thumbnails/open-source.jpg",
    duration: "45:22",
    tags: ["开源", "社区", "民主化"],
    date: "2024-03-10",
    experts: [
      {
        name: "李娜",
        avatar: "/avatars/lisa.png",
        comment: "关于知识共享的讨论非常到位。我观察到开源模型已经在研究和应用之间创建了前所未有的反馈循环。然而，我认为我们也应该解决仍然存在的计算障碍——如果你缺乏运行它们的硬件，拥有模型权重也无济于事。"
      }
    ]
  },
  {
    id: 4,
    title: "医疗领域的AI：改变患者护理",
    summary: "AI在医疗领域的应用在诊断、药物发现和个性化医疗方面显示出令人鼓舞的结果。本期节目探讨了实际实施案例及其对患者结果的影响...",
    type: "audio",
    audioUrl: "/podcasts/ai-healthcare.mp3",
    duration: "28:45",
    tags: ["医疗", "医学", "应用"],
    date: "2024-03-08",
    experts: [
      {
        name: "吴医生",
        avatar: "/avatars/james.png",
        comment: "关于诊断成像的部分与我的工作特别相关。我们发现，当放射科医生的审查结合AI辅助时，早期检测率提高了15-20%。然而，我要强调的是，这些系统最适合作为决策支持工具而非自主系统——人机协作才是关键所在。"
      }
    ]
  },
  {
    id: 5,
    title: "AI的经济学：投资趋势与市场影响",
    summary: "随着数十亿资金流入AI初创公司，以及成熟企业转向AI优先战略，本期节目分析了投资模式、市场动态和AI革命的经济影响...",
    type: "video",
    videoUrl: "/videos/ai-economics.mp4",
    thumbnail: "/thumbnails/economics.jpg",
    duration: "38:10",
    tags: ["经济", "投资", "市场分析"],
    date: "2024-03-05",
    experts: [
      {
        name: "罗德里格斯",
        avatar: "/avatars/emma.png",
        comment: "对风险投资的分析很全面，但我想补充的是，我们看到市场正在出现分化。虽然基础模型公司需要大量资本，但我们也看到在这些模型之上构建的专业AI应用生态系统正在蓬勃发展，采用了更加资本高效的方法。AI技术栈中的这一'工具和基础设施'层可能比那些引人注目的基础模型公司为投资者带来更好的回报。"
      }
    ]
  },
  {
    id: 6,
    title: "AI与创意产业：合作还是竞争？",
    summary: "生成式AI正在改变从艺术和音乐到写作和设计的创意领域。本期节目探讨了创意专业人士如何适应并将AI工具融入他们的工作流程...",
    type: "text",
    tags: ["创意", "艺术", "设计"],
    date: "2024-03-03",
    experts: [
      {
        name: "张涛",
        avatar: "/avatars/alex.png",
        comment: "作为一个在传统设计和AI工具交叉领域工作的人，我发现'合作与竞争'的框架特别贴切。在我的工作室，我们发现AI在创意生成和迭代方面表现出色，而人类设计师则带来批判性判断、文化背景和情感智能。最成功的项目会同时利用两者的优势。我还要补充的是，客户教育正成为我们工作的关键部分——帮助他们理解AI能够可靠地做什么，不能做什么。"
      }
    ]
  }
];

// 内容类型图标
const ContentTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'text':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      );
    case 'audio':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
        </svg>
      );
    case 'video':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
      );
    default:
      return null;
  }
};

// 媒体播放器组件
const AudioPlayer = ({ url, duration }: { url: string, duration: string }) => (
  <div className="bg-gray-100 rounded-md p-3 mt-3">
    <div className="flex items-center space-x-2">
      <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </Button>
      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
        <div className="bg-primary w-1/3 h-full rounded-full"></div>
      </div>
      <span className="text-xs text-gray-500 min-w-[40px]">{duration}</span>
    </div>
  </div>
);

const VideoPlayer = ({ url, thumbnail, duration }: { url: string, thumbnail: string, duration: string }) => (
  <div className="relative mt-3 rounded-md overflow-hidden">
    <div className="aspect-video bg-gray-200 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <Button size="icon" variant="outline" className="h-12 w-12 rounded-full bg-white/80 hover:bg-white/90">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </Button>
      </div>
      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">{duration}</span>
      <div className="text-center text-gray-500">视频缩略图</div>
    </div>
  </div>
);

// 播客项目组件
const PodcastItem = ({ item }: { item: any }) => (
  <Card className="h-full flex flex-col">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <ContentTypeIcon type={item.type} />
        <Badge variant="outline" className="text-xs">
          {item.date}
        </Badge>
      </div>
      <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
      <div className="flex flex-wrap gap-1 mt-2">
        {item.tags.map((tag: string) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="text-gray-600 text-sm">{item.summary}</p>
      
      {item.type === 'audio' && <AudioPlayer url={item.audioUrl} duration={item.duration} />}
      {item.type === 'video' && <VideoPlayer url={item.videoUrl} thumbnail={item.thumbnail} duration={item.duration} />}
    </CardContent>
    <Separator />
    <div className="px-6 py-3">
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={item.experts[0].avatar} alt={item.experts[0].name} />
          <AvatarFallback>{item.experts[0].name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{item.experts[0].name}</span>
      </div>
      <p className="text-sm text-gray-600">{item.experts[0].comment}</p>
    </div>
    <CardFooter className="pt-2 pb-4">
      <Button variant="outline" className="w-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        生成对话脚本
      </Button>
    </CardFooter>
  </Card>
);

// 主组件
export default function PodcastUIDesign() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI播客</h1>
        <p className="text-gray-600">人工智能领域的最新见解和讨论</p>
      </header>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="ai">人工智能</TabsTrigger>
          <TabsTrigger value="ml">机器学习</TabsTrigger>
          <TabsTrigger value="policy">政策与伦理</TabsTrigger>
          <TabsTrigger value="applications">应用</TabsTrigger>
          <TabsTrigger value="business">商业</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcastItems.map(item => (
              <PodcastItem key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ai" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcastItems
              .filter(item => item.tags.includes('人工智能'))
              .map(item => (
                <PodcastItem key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>
        
        {/* 其他标签内容将遵循相同的模式 */}
      </Tabs>
    </div>
  );
} 