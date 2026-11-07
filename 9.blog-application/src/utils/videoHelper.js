/**
 * Normalizes video URLs to ensure they can be embedded in an <iframe>.
 * Supports standard YouTube links, shortened youtu.be links, and direct embeds.
 */
export const getEmbedVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // Already an embed URL
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // Standard YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // Shortened youtu.be URL: https://youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  // Vimeo URL: https://vimeo.com/VIDEO_ID
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
};

/**
 * Validates if a string looks like a valid video URL.
 */
export const isValidVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/.test(url.trim());
};
