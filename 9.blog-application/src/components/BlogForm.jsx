import React, { useState, useEffect } from 'react';
import { BLOG_CATEGORIES } from '../data/categories';
import { PRESET_COVERS } from '../data/presetCovers';
import { countWords, MAX_BLOG_WORDS, calculateReadTime } from '../utils/wordCounter';
import { getEmbedVideoUrl } from '../utils/videoHelper';
import {
  IconArrowLeft,
  IconCheck,
  IconImage,
  IconVideo,
  IconAlert,
  IconSparkles
} from './Icons';

export default function BlogForm({
  initialData = null,
  isEditing = false,
  onSubmit,
  onCancel,
  isSubmitting = false
}) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    authorRole: '',
    category: BLOG_CATEGORIES[1].name,
    coverImage: '',
    videoUrl: '',
    excerpt: '',
    content: '',
    tags: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Sync state if initialData is provided (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        authorRole: initialData.authorRole || '',
        category: initialData.category || BLOG_CATEGORIES[1].name,
        coverImage: initialData.coverImage || '',
        videoUrl: initialData.videoUrl || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || '')
      });
    }
  }, [initialData]);

  // Real-time word count calculation
  const currentWordCount = countWords(formData.content);
  const isWordLimitExceeded = currentWordCount > MAX_BLOG_WORDS;
  const isApproachingLimit = currentWordCount > 900 && currentWordCount <= MAX_BLOG_WORDS;
  const wordCountPercentage = Math.min(100, (currentWordCount / MAX_BLOG_WORDS) * 100);

  // Field Validation
  const validate = (data = formData) => {
    const errs = {};
    if (!data.title.trim()) {
      errs.title = 'Blog title is required.';
    } else if (data.title.trim().length < 5) {
      errs.title = 'Title should be at least 5 characters long.';
    }

    if (!data.author.trim()) {
      errs.author = 'Author name is required.';
    }

    if (!data.category) {
      errs.category = 'Please select a category.';
    }

    if (!data.content.trim()) {
      errs.content = 'Blog content body cannot be empty.';
    } else {
      const words = countWords(data.content);
      if (words > MAX_BLOG_WORDS) {
        errs.content = `Blog content exceeds the maximum limit of ${MAX_BLOG_WORDS} words (currently ${words} words). Please shorten your post.`;
      }
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate());
  };

  const handleSelectPresetCover = (url) => {
    setFormData((prev) => ({ ...prev, coverImage: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched({
        title: true,
        author: true,
        category: true,
        content: true
      });
      return;
    }

    // Process tags into array
    const parsedTags = formData.tags
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    const todayDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      authorRole: formData.authorRole.trim() || 'Contributor',
      category: formData.category,
      coverImage: formData.coverImage.trim() || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80',
      videoUrl: formData.videoUrl.trim(),
      excerpt: formData.excerpt.trim() || (formData.content.substring(0, 120) + '...'),
      content: formData.content.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ['general'],
      readTime: calculateReadTime(currentWordCount),
      date: initialData && initialData.date ? initialData.date : todayDate
    };

    onSubmit(payload);
  };

  const previewVideoEmbed = getEmbedVideoUrl(formData.videoUrl);

  return (
    <div className="blog-form-container">
      <div className="form-top-nav">
        <button type="button" className="btn-back-link" onClick={onCancel}>
          <IconArrowLeft size={18} /> Cancel & return
        </button>
      </div>

      <div className="form-card-box">
        <div className="form-heading-row">
          <div>
            <h2 className="form-main-title">
              {isEditing ? 'Edit Blog Article' : 'Write a New Article'}
            </h2>
            <p className="form-main-subtitle">
              {isEditing
                ? 'Update your blog content, media embeds, and topic categories'
                : 'Share your insights with readable content, images, and embedded videos (Max 1,000 words)'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="blog-post-form">
          {/* Title */}
          <div className="form-field-group">
            <label htmlFor="blog-title" className="form-label">
              Article Title <span className="req-star">*</span>
            </label>
            <input
              id="blog-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Understanding Modern React State and Server Actions"
              className={`text-input ${touched.title && errors.title ? 'input-error' : ''}`}
            />
            {touched.title && errors.title && (
              <span className="field-error-msg">{errors.title}</span>
            )}
          </div>

          {/* Author Name and Role (2 Columns) */}
          <div className="form-row-2col">
            <div className="form-field-group">
              <label htmlFor="blog-author" className="form-label">
                Author Name <span className="req-star">*</span>
              </label>
              <input
                id="blog-author"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g., Birat Dey"
                className={`text-input ${touched.author && errors.author ? 'input-error' : ''}`}
              />
              {touched.author && errors.author && (
                <span className="field-error-msg">{errors.author}</span>
              )}
            </div>

            <div className="form-field-group">
              <label htmlFor="blog-authorRole" className="form-label">
                Author Role / Designation
              </label>
              <input
                id="blog-authorRole"
                type="text"
                name="authorRole"
                value={formData.authorRole}
                onChange={handleChange}
                placeholder="e.g., Frontend Developer / UI Specialist"
                className="text-input"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="form-field-group">
            <label htmlFor="blog-category" className="form-label">
              Topic Category <span className="req-star">*</span>
            </label>
            <select
              id="blog-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="styled-select"
            >
              {BLOG_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image URL and Preset Selector */}
          <div className="form-field-group media-field-section">
            <div className="media-field-header">
              <label htmlFor="blog-coverImage" className="form-label">
                <IconImage size={16} /> Cover Image URL
              </label>
            </div>
            <input
              id="blog-coverImage"
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="text-input"
            />

            {/* Quick preset thumbnail buttons */}
            <div className="preset-cover-picker">
              <span className="picker-hint">Quick Presets:</span>
              <div className="preset-thumbs-row">
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="preset-cover-chip"
                    onClick={() => handleSelectPresetCover(preset.url)}
                  >
                    <img src={preset.url} alt={preset.label} className="chip-thumb" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Image Preview */}
            {formData.coverImage && (
              <div className="cover-live-preview">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="preview-img-frame"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Video URL (Embeddable YouTube / Vimeo / MP4) */}
          <div className="form-field-group media-field-section">
            <label htmlFor="blog-videoUrl" className="form-label">
              <IconVideo size={16} /> Video URL (Optional YouTube / Vimeo Embed)
            </label>
            <input
              id="blog-videoUrl"
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/..."
              className="text-input"
            />
            <span className="field-hint">
              Paste standard YouTube links or Vimeo URLs to embed an interactive video player inside your post.
            </span>

            {/* Live Video Embed Preview */}
            {previewVideoEmbed && (
              <div className="video-live-preview">
                <span className="preview-label">Live Video Embed Preview:</span>
                <div className="video-preview-frame">
                  <iframe
                    src={previewVideoEmbed}
                    title="Video preview"
                    frameBorder="0"
                    allowFullScreen
                    className="preview-iframe"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Excerpt / Summary */}
          <div className="form-field-group">
            <label htmlFor="blog-excerpt" className="form-label">
              Short Excerpt / Summary
            </label>
            <input
              id="blog-excerpt"
              type="text"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="A brief 1-2 sentence hook describing your story..."
              className="text-input"
            />
          </div>

          {/* Content / Body with 1000-Word Limit Enforcement */}
          <div className="form-field-group content-editor-group">
            <div className="content-label-row">
              <label htmlFor="blog-content" className="form-label">
                Article Body Content <span className="req-star">*</span>
              </label>

              {/* Word Count Indicator Meter */}
              <div
                className={`word-counter-badge ${
                  isWordLimitExceeded
                    ? 'counter-danger'
                    : isApproachingLimit
                    ? 'counter-warning'
                    : 'counter-normal'
                }`}
              >
                <span>{currentWordCount}</span> / {MAX_BLOG_WORDS} words
              </div>
            </div>

            {/* Visual Word Count Progress Meter */}
            <div className="word-progress-bar-bg">
              <div
                className={`word-progress-bar-fill ${
                  isWordLimitExceeded
                    ? 'fill-danger'
                    : isApproachingLimit
                    ? 'fill-warning'
                    : 'fill-normal'
                }`}
                style={{ width: `${wordCountPercentage}%` }}
              />
            </div>

            <textarea
              id="blog-content"
              name="content"
              rows="12"
              value={formData.content}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Write your article text here. Use paragraph breaks to structure your story..."
              className={`content-textarea ${touched.content && errors.content ? 'input-error' : ''}`}
            />

            {/* Real-time word limit alert */}
            {isWordLimitExceeded && (
              <div className="word-limit-alert-banner">
                <IconAlert size={16} />
                <span>
                  <strong>Limit Exceeded:</strong> Content is currently <strong>{currentWordCount}</strong> words.
                  The maximum limit is {MAX_BLOG_WORDS} words. Please trim your content to submit.
                </span>
              </div>
            )}

            {isApproachingLimit && (
              <span className="word-approaching-note">
                Notice: Approaching the 1,000-word limit ({MAX_BLOG_WORDS - currentWordCount} words remaining).
              </span>
            )}

            {touched.content && errors.content && !isWordLimitExceeded && (
              <span className="field-error-msg">{errors.content}</span>
            )}
          </div>

          {/* Tags */}
          <div className="form-field-group">
            <label htmlFor="blog-tags" className="form-label">
              Tags / Keywords
            </label>
            <input
              id="blog-tags"
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., react, javascript, webdev (comma separated)"
              className="text-input"
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions-bar">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-submit-article"
              disabled={isSubmitting || isWordLimitExceeded}
            >
              {isSubmitting ? (
                <>Saving Article...</>
              ) : isEditing ? (
                <>
                  <IconCheck size={16} /> Update Article
                </>
              ) : (
                <>
                  <IconSparkles size={16} /> Publish Article
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
