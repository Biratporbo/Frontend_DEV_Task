export const MAX_BLOG_WORDS = 1000;

/**
 * Counts the number of words in a string accurately.
 * Words are delimited by one or more whitespace characters.
 */
export const countWords = (text) => {
  if (!text || typeof text !== 'string') return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
};

/**
 * Estimates reading time based on an average reading speed of 200 words per minute.
 */
export const calculateReadTime = (textOrWordCount) => {
  const wordCount = typeof textOrWordCount === 'number' ? textOrWordCount : countWords(textOrWordCount);
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
};

/**
 * Checks if content is within the 1000-word limit.
 */
export const isWithinWordLimit = (text) => {
  return countWords(text) <= MAX_BLOG_WORDS;
};
