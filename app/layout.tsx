import React from 'react';
import { Inter } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import './styles/globals.css';
import './styles/theme.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI 播客',
  description: '发现和收听最好的 AI 相关播客',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
} 