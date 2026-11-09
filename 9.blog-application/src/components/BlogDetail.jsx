import React from 'react';
import { getCategoryColor } from '../data/categories';
import { countWords } from '../utils/wordCounter';
import { getEmbedVideoUrl } from '../utils/videoHelper';
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconUser,
  IconClock,
  IconCalendar,
  IconVideo,
  IconTag
} from './Icons';

export default function BlogDetail({ blog, onBack, onEdit, onDelete }) {
  if (!blog) return null;

  const categoryColor = getCategoryColor(blog.category);
  const wordCount = countWords(blog.content);
  const embedUrl = getEmbedVideoUrl(blog.videoUrl);

  // Split content by double newlines or single newlines for readable paragraphs
  const paragraphs = (blog.content || '')
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0);

  return (
    <article className="blog-detail-container">
      {/* Top Nav Back Bar */}
      <div className="detail-top-nav">
        <button type="button" className="btn-back-link" onClick={onBack}>
          <IconArrowLeft size={18} /> Back to all stories
        </button>

        <div className="detail-action-buttons">
          <button
            type="button"
            className="btn btn-secondary btn-detail-action"
            onClick={() => onEdit(blog.id)}
          >
            <IconEdit size={15} /> Edit
          </button>
          <button
            type="button"
            className="btn btn-danger btn-detail-action"
            onClick={() => onDelete(blog)}
          >
            <IconTrash size={15} /> Delete
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="article-header">
        <div className="article-meta-pills">
          <span
            className="detail-category-badge"
            style={{
              backgroundColor: `${categoryColor}14`,
              color: categoryColor,
              borderColor: `${categoryColor}30`
            }}
          >
            {blog.category || 'Article'}
          </span>
          <span className="meta-pill">
            <IconClock size={13} /> {blog.readTime || '3 min read'}
          </span>
          <span className="meta-pill">
            <IconCalendar size={13} /> {blog.date || 'Recent'}
          </span>
          <span className="meta-pill word-count-pill">
            {wordCount} words
          </span>
        </div>

        <h1 className="article-headline">{blog.title}</h1>

        {blog.excerpt && (
          <p className="article-subheadline">{blog.excerpt}</p>
        )}

        {/* Author Bio Card */}
        <div className="article-author-card">
          <div className="author-avatar-large">
            <IconUser size={20} />
          </div>
          <div className="author-text">
            <div className="author-primary">
              <span className="author-full-name">{blog.author || 'Anonymous'}</span>
              {blog.authorRole && (
                <span className="author-role-tag">&bull; {blog.authorRole}</span>
              )}
            </div>
            <span className="author-publish-stamp">
              Published on {blog.date || 'Recently'}
            </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="article-featured-image-box">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="article-featured-img"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Embedded Video Player Section (if video provided) */}
      {embedUrl && (
        <section className="article-video-section">
          <div className="video-section-header">
            <IconVideo size={18} />
            <span>Featured Video Presentation</span>
          </div>
          <div className="video-iframe-wrapper">
            <iframe
              src={embedUrl}
              title={`${blog.title} - Video presentation`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="video-iframe"
            />
          </div>
        </section>
      )}

      {/* Article Body Content */}
      <section className="article-body-content">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="content-paragraph">
            {para}
          </p>
        ))}
      </section>

      {/* Article Footer Tags */}
      {Array.isArray(blog.tags) && blog.tags.length > 0 && (
        <footer className="article-tags-footer">
          <span className="tags-label">
            <IconTag size={14} /> Topics & Tags:
          </span>
          <div className="tags-chips-list">
            {blog.tags.map((tag, idx) => (
              <span key={idx} className="tag-chip">
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      )}

      {/* Bottom Back Button */}
      <div className="article-bottom-nav">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <IconArrowLeft size={16} /> Back to All Articles
        </button>
      </div>
    </article>
  );
}
