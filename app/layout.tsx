import React from 'react';
import { Inter } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/tooltip';
import './styles/globals.css';
import './styles/theme.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '砖家说 Pro',
  description: '发掘你的渴求，找到你的答案',
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