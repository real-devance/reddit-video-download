import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

export async function downloadFile(url, outputPath) {
  try {
    const res = await fetch(url);

    if (!res.ok || !res.body) {
      throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    }

    const fileStream = createWriteStream(outputPath);
    await pipeline(res.body, fileStream);

    console.log('✅ File downloaded:', outputPath);
  } catch (error) {
    console.error('❌ Download failed:', error);
    throw error;
  }
}
