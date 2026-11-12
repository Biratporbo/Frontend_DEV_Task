import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8'
    },
    secondary: {
      main: '#475569'
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b'
    },
    success: {
      main: '#16a34a'
    },
    info: {
      main: '#2563eb'
    },
    warning: {
      main: '#d97706'
    },
    error: {
      main: '#dc2626'
    }
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h5: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 600
    },
    subtitle2: {
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 10
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600
        }
      }
    }
  }
});

export default theme;
