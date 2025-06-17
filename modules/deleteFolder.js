import { rm } from 'fs/promises';

/**
 * Deletes a folder and all its contents recursively.
 *
 * @param {string} path - Absolute or relative path to the folder to delete
 * @returns {Promise<void>}
 */
export async function deleteFolder(path) {
  try {
    await rm(path, { recursive: true, force: true });
    console.log(`🗑️ Deleted folder: ${path}`);
  } catch (error) {
    console.error(`❌ Failed to delete folder ${path}:`, error);
    throw error;
  }
}
