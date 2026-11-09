import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import BlogForm from './components/BlogForm';
import DeleteModal from './components/DeleteModal';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Toast from './components/Toast';
import {
  fetchBlogs,
  fetchBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from './services/api';
import './App.css';

function App() {
  // Navigation View State: 'list' | 'detail' | 'create' | 'edit'
  const [currentView, setCurrentView] = useState('list');
  const [activeBlogId, setActiveBlogId] = useState(null);

  // Data & Request States
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSource, setApiSource] = useState('REST API');

  // Search & Filter States
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('newest');

  // Modal & Toast States
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [toast, setToast] = useState(null);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3400);
  };

  // Load all blogs (or filtered by keyword) from REST API
  const loadBlogs = useCallback(async (keyword = '') => {
    setIsLoading(true);
    setApiError(null);
    try {
      const result = await fetchBlogs(keyword);
      setBlogs(result.data || []);
      setApiSource(result.source || 'REST API');
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setApiError('Failed to fetch blog posts from the API server. Please ensure JSON Server is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  // Handle Keyword Search with slight debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadBlogs(searchKeyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKeyword, loadBlogs]);

  // Load single blog when viewing detail or editing
  useEffect(() => {
    if ((currentView === 'detail' || currentView === 'edit') && activeBlogId) {
      let isMounted = true;
      setIsLoading(true);
      fetchBlogById(activeBlogId)
        .then((res) => {
          if (isMounted) {
            setSelectedBlog(res.data);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setApiError(err.message || 'Could not load the requested article.');
            setIsLoading(false);
          }
        });
      return () => {
        isMounted = false;
      };
    }
  }, [currentView, activeBlogId]);

  // Navigation handlers
  const handleNavigate = (view, blogId = null) => {
    setApiError(null);
    setActiveBlogId(blogId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CRUD Operation: Create Blog
  const handleCreateBlog = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await createBlog(formData);
      showToast('Article published successfully!');
      await loadBlogs(searchKeyword);
      handleNavigate('detail', res.data.id);
    } catch (err) {
      showToast('Failed to create article. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CRUD Operation: Update Blog
  const handleUpdateBlog = async (formData) => {
    if (!activeBlogId) return;
    setIsSubmitting(true);
    try {
      const res = await updateBlog(activeBlogId, formData);
      showToast('Article updated successfully!');
      setSelectedBlog(res.data);
      await loadBlogs(searchKeyword);
      handleNavigate('detail', activeBlogId);
    } catch (err) {
      showToast('Failed to update article.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CRUD Operation: Delete Blog
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      await deleteBlog(id);
      showToast('Article deleted successfully.');
      setDeletingBlog(null);
      await loadBlogs(searchKeyword);
      handleNavigate('list');
    } catch (err) {
      showToast('Failed to delete article.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Client-side filtering & sorting of retrieved blogs
  const displayedBlogs = useMemo(() => {
    let result = [...blogs];

    // Category filter
    if (selectedCategory && selectedCategory !== 'All Categories') {
      result = result.filter(
        (b) => (b.category || '').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = a.createdAt || new Date(a.date).getTime() || 0;
        const dateB = b.createdAt || new Date(b.date).getTime() || 0;
        return dateB - dateA;
      }
      if (sortBy === 'oldest') {
        const dateA = a.createdAt || new Date(a.date).getTime() || 0;
        const dateB = b.createdAt || new Date(b.date).getTime() || 0;
        return dateA - dateB;
      }
      if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    return result;
  }, [blogs, selectedCategory, sortBy]);

  return (
    <div className="app-container">
      {/* Toast Alert */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => handleNavigate(view)}
        apiSource={apiSource}
      />

      <main className="main-content-layout">
        <div className="content-max-width">
          {/* Global API Error Banner */}
          {apiError && (
            <ErrorMessage
              error={apiError}
              onRetry={() => {
                if (currentView === 'detail' && activeBlogId) {
                  handleNavigate('detail', activeBlogId);
                } else {
                  loadBlogs(searchKeyword);
                }
              }}
            />
          )}

          {/* Loading Indicator */}
          {isLoading && currentView !== 'create' && currentView !== 'edit' ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* VIEW: All Blogs List */}
              {currentView === 'list' && (
                <BlogList
                  blogs={displayedBlogs}
                  totalBlogsCount={blogs.length}
                  searchKeyword={searchKeyword}
                  onSearchChange={setSearchKeyword}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onView={(id) => handleNavigate('detail', id)}
                  onEdit={(id) => handleNavigate('edit', id)}
                  onDelete={(blog) => setDeletingBlog(blog)}
                  onNavigateCreate={() => handleNavigate('create')}
                />
              )}

              {/* VIEW: Blog Detail */}
              {currentView === 'detail' && selectedBlog && (
                <BlogDetail
                  blog={selectedBlog}
                  onBack={() => handleNavigate('list')}
                  onEdit={(id) => handleNavigate('edit', id)}
                  onDelete={(blog) => setDeletingBlog(blog)}
                />
              )}

              {/* VIEW: Create New Blog */}
              {currentView === 'create' && (
                <BlogForm
                  isEditing={false}
                  onSubmit={handleCreateBlog}
                  onCancel={() => handleNavigate('list')}
                  isSubmitting={isSubmitting}
                />
              )}

              {/* VIEW: Edit Existing Blog */}
              {currentView === 'edit' && selectedBlog && (
                <BlogForm
                  initialData={selectedBlog}
                  isEditing={true}
                  onSubmit={handleUpdateBlog}
                  onCancel={() => handleNavigate('detail', activeBlogId)}
                  isSubmitting={isSubmitting}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deletingBlog && (
        <DeleteModal
          blog={deletingBlog}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingBlog(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <p className="footer-copyright">
            BlogVerse &copy; {new Date().getFullYear()} &mdash; Responsive Single Page Blog Application with CRUD & REST API.
          </p>
          <div className="footer-specs">
            <span>• REST API (JSON Server)</span>
            <span>• Axios HTTP Client</span>
            <span>• 1,000-Word Limit Guard</span>
            <span>• Responsive Video & Image Embeds</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
