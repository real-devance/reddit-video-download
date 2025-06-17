export async function getRedditVideo(URL) {
  const res = await fetch(URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch URL: ${res.statusText}`);
  }

  const data = await res.json();
  const posts = data.data.children;

  const content = [];

  for (const post of posts) {
    const p = post.data;
    if (
      p.is_video &&
      p.media?.reddit_video?.fallback_url &&
      p.media.reddit_video.fallback_url.includes("https://v.redd.it/")
    ) {
      const id = p.id;
      const dashURL = p.media.reddit_video.fallback_url;
      const videoURL = dashURL.split("?")[0];
      const audioURL = dashURL.split("_")[0] + "_AUDIO_128.mp4";

      content.push({
        id,
        title: p.title.slice(0, 280),
        videoURL,
        audioURL,
      });
    }
  }

  if (content.length === 0) {
    throw new Error("No Reddit videos with fallback_url found");
  }

  return content;
}
