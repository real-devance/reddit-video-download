import { mkdir } from 'fs/promises';
import { join } from 'path';
import { downloadFile } from './download.js';

// Utility to sanitize folder/file names
function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-]/gi, '_').slice(0, 50).trim() || 'untitled';
}

/**
 * Downloads and saves video & audio files for a single Reddit post.
 * @param {Object} post - Reddit post with title, id, videoURL, audioURL
 * @param {string} baseDir - Base directory where media will be saved
 * @returns {Promise<{ videoPath: string, audioPath: string, folderPath: string }>}
 */
export async function saveMedia(post, baseDir = './videos') {
  const safeTitle = sanitizeFilename(post.title);
  const folderPath = join(baseDir, safeTitle);
  await mkdir(folderPath, { recursive: true });

  const videoPath = join(folderPath, `${post.id}.mp4`);
  const audioPath = join(folderPath, `${post.id}_audio.mp4`);

  await downloadFile(post.videoURL, videoPath);
  await downloadFile(post.audioURL, audioPath);

  return { videoPath, audioPath, folderPath };
}
