export const BLOG_CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'react-frontend', name: 'React & Frontend', color: '#2563eb' },
  { id: 'api-backend', name: 'API & Backend', color: '#059669' },
  { id: 'design-ux', name: 'Design & UX', color: '#d97706' },
  { id: 'typescript', name: 'TypeScript', color: '#7c3aed' },
  { id: 'web-performance', name: 'Web Performance', color: '#dc2626' },
  { id: 'tutorials-guides', name: 'Tutorials & Guides', color: '#0891b2' },
  { id: 'career-insights', name: 'Career & Insights', color: '#4b5563' }
];

export const getCategoryColor = (categoryName) => {
  const match = BLOG_CATEGORIES.find(
    (c) => c.name.toLowerCase() === (categoryName || '').toLowerCase()
  );
  return match ? match.color : '#2563eb';
};
