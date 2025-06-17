import { spawn } from 'child_process';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import ffmpegPath from 'ffmpeg-static';

/**
 * Merges a video and audio file into a single MP4 saved under `videos/merged/`.
 *
 * @param {string} videoPath - Path to the video file
 * @param {string} audioPath - Path to the audio file
 * @param {string} title - Title for the merged file (used in filename)
 * @param {string} baseFolder - Base output folder (default is "videos")
 * @returns {Promise<string>} Full path of merged file
 */
export async function mergeMedia(videoPath, audioPath, title, baseFolder = 'videos') {
  const safeTitle = title.replace(/[^a-z0-9_\-]/gi, '_').slice(0, 50).trim() || 'untitled';
  const mergedDir = join(baseFolder, 'merged');
  await mkdir(mergedDir, { recursive: true });

  const outputPath = join(mergedDir, `${safeTitle}.mp4`);

  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      '-i', videoPath,
      '-i', audioPath,
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-strict', 'experimental',
      '-y',
      outputPath
    ]);

    ffmpeg.stderr.on('data', (data) => process.stderr.write(data));
    ffmpeg.on('close', (code) => {
      code === 0 ? resolve(outputPath) : reject(new Error(`FFmpeg exited with code ${code}`));
    });
    ffmpeg.on('error', reject);
  });
}
