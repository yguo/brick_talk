import { NextResponse } from 'next/server';
import { importDataFromJson } from '../../../app/lib/db/importData';

// 导入数据
export async function POST() {
  try {
    const result = await importDataFromJson();
    return NextResponse.json(result);
  } catch (error) {
    console.error('导入数据失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '导入数据失败' }, 
      { status: 500 }
    );
  }
} 