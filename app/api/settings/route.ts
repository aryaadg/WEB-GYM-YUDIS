import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'site-settings.json');

export async function GET() {
  try {
    const fileData = await readFile(settingsPath, 'utf-8');
    return NextResponse.json(JSON.parse(fileData));
  } catch {
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await writeFile(settingsPath, JSON.stringify(body, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
