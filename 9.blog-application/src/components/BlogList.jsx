import React from 'react';
import BlogCard from './BlogCard';
import { BLOG_CATEGORIES } from '../data/categories';
import { IconSearch, IconX, IconBook, IconPlus } from './Icons';

export default function BlogList({
  blogs = [],
  totalBlogsCount = 0,
  searchKeyword,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  onView,
  onEdit,
  onDelete,
  onNavigateCreate
}) {
  const isFiltering = searchKeyword.trim() !== '' || selectedCategory !== 'all';

  return (
    <div className="blog-list-wrapper">
      {/* Search & Filter Toolbar */}
      <div className="discovery-toolbar">
        <div className="search-bar-wrap">
          <IconSearch size={18} className="search-icon" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search blogs by keyword, title, author, or tags..."
            className="search-input"
          />
          {searchKeyword && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <IconX size={14} />
            </button>
          )}
        </div>

        <div className="filter-selects-row">
          {/* Category Filter */}
          <div className="control-select-wrap">
            <label className="select-label">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="styled-select"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="control-select-wrap">
            <label className="select-label">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="styled-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {isFiltering && (
            <button
              type="button"
              className="btn-reset-filters"
              onClick={() => {
                onSearchChange('');
                onSelectCategory('All Categories');
              }}
            >
              <IconX size={13} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Header Status */}
      <div className="results-status-bar">
        <span className="results-count-text">
          Showing <strong>{blogs.length}</strong> of <strong>{totalBlogsCount}</strong> published articles
        </span>
        {searchKeyword && (
          <span className="search-query-tag">
            Keyword: <em>"{searchKeyword}"</em>
          </span>
        )}
      </div>

      {/* Blog Cards Grid or Empty State */}
      {blogs.length > 0 ? (
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-blogs-container">
          <div className="empty-icon-circle">
            <IconBook size={36} />
          </div>
          <h3 className="empty-title">
            {totalBlogsCount === 0
              ? 'No blog posts available yet'
              : 'No matching articles found'}
          </h3>
          <p className="empty-description">
            {totalBlogsCount === 0
              ? 'Be the first author to write and publish a story on BlogVerse!'
              : `We couldn't find any articles matching your search query. Try searching for different keywords or resetting the filter.`}
          </p>
          {totalBlogsCount === 0 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onNavigateCreate}
            >
              <IconPlus size={16} /> Write First Article
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onSearchChange('');
                onSelectCategory('All Categories');
              }}
            >
              Clear Search & Show All
            </button>
          )}
        </div>
      )}
    </div>
  );
}
