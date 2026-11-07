import React from 'react';
import { getCategoryColor } from '../data/categories';
import { IconClock, IconUser, IconEdit, IconTrash, IconVideo, IconCalendar } from './Icons';

export default function BlogCard({ blog, onView, onEdit, onDelete }) {
  const categoryColor = getCategoryColor(blog.category);
  const hasVideo = Boolean(blog.videoUrl && blog.videoUrl.trim());

  return (
    <article className="blog-card">
      {/* Cover Image Frame */}
      <div className="card-media-frame" onClick={() => onView(blog.id)}>
        <img
          src={blog.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
          alt={blog.title}
          className="card-cover-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {hasVideo && (
          <span className="card-video-pill" title="This post includes an embedded video">
            <IconVideo size={13} /> Video
          </span>
        )}
      </div>

      {/* Card Content Area */}
      <div className="card-body">
        <div className="card-meta-row">
          <span
            className="card-category-badge"
            style={{
              backgroundColor: `${categoryColor}14`,
              color: categoryColor,
              borderColor: `${categoryColor}30`
            }}
          >
            {blog.category || 'General'}
          </span>
          <span className="card-read-time">
            <IconClock size={12} /> {blog.readTime || '3 min read'}
          </span>
        </div>

        <h3 className="card-title" onClick={() => onView(blog.id)}>
          {blog.title}
        </h3>

        <p className="card-excerpt">
          {blog.excerpt || (blog.content ? blog.content.substring(0, 110) + '...' : '')}
        </p>

        {/* Footer with Author and Actions */}
        <div className="card-footer">
          <div className="card-author-info">
            <div className="author-avatar-circle">
              <IconUser size={14} />
            </div>
            <div className="author-details">
              <span className="author-name">{blog.author || 'Anonymous'}</span>
              <span className="author-date">
                <IconCalendar size={11} /> {blog.date || 'Recent'}
              </span>
            </div>
          </div>

          <div className="card-actions">
            <button
              type="button"
              className="action-icon-btn btn-edit-icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(blog.id);
              }}
              title="Edit Post"
            >
              <IconEdit size={15} />
            </button>
            <button
              type="button"
              className="action-icon-btn btn-delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(blog);
              }}
              title="Delete Post"
            >
              <IconTrash size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
