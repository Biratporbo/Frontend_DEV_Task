import axios from 'axios';
import initialDb from '../data/initialBlogs.json';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const LOCAL_STORAGE_KEY = 'blogverse_blogs_store_v1';

// Create Axios Client instance with 4-second timeout
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to initialize local fallback storage if empty
const getFallbackBlogs = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const defaultData = initialDb.blogs || [];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (e) {
    return initialDb.blogs || [];
  }
};

const saveFallbackBlogs = (blogs) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(blogs));
  } catch (e) {
    console.error('Failed to save to localStorage fallback:', e);
  }
};

/**
 * Fetch all blogs, optionally filtered by keyword query
 * REST Endpoint: GET /blogs or GET /blogs?q=keyword
 */
export const fetchBlogs = async (keyword = '') => {
  const trimmed = keyword.trim().toLowerCase();
  try {
    const url = trimmed ? `/blogs?q=${encodeURIComponent(trimmed)}` : '/blogs';
    const response = await apiClient.get(url);
    return { data: response.data, source: 'REST API' };
  } catch (error) {
    console.warn('REST API unavailable, using resilient fallback storage:', error.message);
    const blogs = getFallbackBlogs();
    if (!trimmed) {
      return { data: blogs, source: 'Offline Storage' };
    }
    const filtered = blogs.filter((b) => {
      const matchTitle = (b.title || '').toLowerCase().includes(trimmed);
      const matchAuthor = (b.author || '').toLowerCase().includes(trimmed);
      const matchCategory = (b.category || '').toLowerCase().includes(trimmed);
      const matchContent = (b.content || '').toLowerCase().includes(trimmed);
      const matchTags = Array.isArray(b.tags) && b.tags.some((t) => t.toLowerCase().includes(trimmed));
      return matchTitle || matchAuthor || matchCategory || matchContent || matchTags;
    });
    return { data: filtered, source: 'Offline Storage' };
  }
};

/**
 * Fetch a single blog by ID
 * REST Endpoint: GET /blogs/:id
 */
export const fetchBlogById = async (id) => {
  try {
    const response = await apiClient.get(`/blogs/${id}`);
    return { data: response.data, source: 'REST API' };
  } catch (error) {
    console.warn(`REST API failed for blog ${id}, checking fallback storage`);
    const blogs = getFallbackBlogs();
    const found = blogs.find((b) => String(b.id) === String(id));
    if (!found) {
      throw new Error(`Blog post with ID "${id}" was not found.`);
    }
    return { data: found, source: 'Offline Storage' };
  }
};

/**
 * Create a new blog post
 * REST Endpoint: POST /blogs
 */
export const createBlog = async (blogData) => {
  const newPost = {
    ...blogData,
    id: blogData.id || String(Date.now()),
    createdAt: Date.now()
  };

  try {
    const response = await apiClient.post('/blogs', newPost);
    // Also sync fallback cache
    const blogs = getFallbackBlogs();
    saveFallbackBlogs([response.data, ...blogs]);
    return { data: response.data, source: 'REST API' };
  } catch (error) {
    console.warn('REST API offline, storing new blog in fallback storage');
    const blogs = getFallbackBlogs();
    const updated = [newPost, ...blogs];
    saveFallbackBlogs(updated);
    return { data: newPost, source: 'Offline Storage' };
  }
};

/**
 * Update an existing blog post
 * REST Endpoint: PUT /blogs/:id
 */
export const updateBlog = async (id, blogData) => {
  try {
    const response = await apiClient.put(`/blogs/${id}`, blogData);
    // Sync fallback
    const blogs = getFallbackBlogs();
    const updated = blogs.map((b) => (String(b.id) === String(id) ? response.data : b));
    saveFallbackBlogs(updated);
    return { data: response.data, source: 'REST API' };
  } catch (error) {
    console.warn(`REST API offline, updating blog ${id} in fallback storage`);
    const blogs = getFallbackBlogs();
    const index = blogs.findIndex((b) => String(b.id) === String(id));
    if (index === -1) {
      throw new Error(`Cannot update: Blog with ID "${id}" does not exist.`);
    }
    const updatedPost = { ...blogs[index], ...blogData };
    blogs[index] = updatedPost;
    saveFallbackBlogs(blogs);
    return { data: updatedPost, source: 'Offline Storage' };
  }
};

/**
 * Delete a blog post
 * REST Endpoint: DELETE /blogs/:id
 */
export const deleteBlog = async (id) => {
  try {
    await apiClient.delete(`/blogs/${id}`);
    const blogs = getFallbackBlogs();
    const filtered = blogs.filter((b) => String(b.id) !== String(id));
    saveFallbackBlogs(filtered);
    return { success: true, source: 'REST API' };
  } catch (error) {
    console.warn(`REST API offline, deleting blog ${id} from fallback storage`);
    const blogs = getFallbackBlogs();
    const filtered = blogs.filter((b) => String(b.id) !== String(id));
    saveFallbackBlogs(filtered);
    return { success: true, source: 'Offline Storage' };
  }
};

export default apiClient;
