import { getRedditVideo } from "./modules/getRedditVideo.js";
import { saveMedia } from "./modules/saveMedia.js";
import { mergeMedia } from "./modules/mergeMedia.js";
import { deleteFolder } from "./modules/deleteFolder.js";
import { join } from "path";

const url = "https://www.reddit.com/r/IrrationalMadness/top.json?limit=25&t=day";

function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_\-]/gi, '_').slice(0, 50).trim() || 'untitled';
}

async function main() {
  try {
    const reddit_posts = await getRedditVideo(url);
    const foldersToDelete = [];

    for (const post of reddit_posts) {
      const safeTitle = sanitizeFilename(post.title);
      const folderPath = join("videos", safeTitle);

      const { videoPath, audioPath } = await saveMedia(post);
      await mergeMedia(videoPath, audioPath, post.title, 'videos');

      foldersToDelete.push(folderPath);
    }

    // Optional: delete folders after merging
    for (const folderPath of foldersToDelete) {
      await deleteFolder(folderPath);
    }

    console.log("🎉 All videos merged and original folders deleted!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();
