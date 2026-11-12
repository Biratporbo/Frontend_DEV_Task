import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Container,
  Chip
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export function Header({ totalFilteredCount, onExportCsv }) {
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        zIndex: (theme) => theme.zIndex.appBar
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 0.75, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <StorefrontIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ lineHeight: 1.2, color: '#0f172a', fontWeight: 700 }}>
                OrderPulse
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                Order Management &amp; Analytics Dashboard
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label={`${totalFilteredCount} ${totalFilteredCount === 1 ? 'Order' : 'Orders'} Shown`}
              size="small"
              sx={{
                backgroundColor: '#f1f5f9',
                color: '#334155',
                fontWeight: 600,
                display: { xs: 'none', sm: 'inline-flex' }
              }}
            />
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownloadIcon />}
              onClick={onExportCsv}
              disabled={totalFilteredCount === 0}
              sx={{
                borderColor: '#cbd5e1',
                color: '#1e293b',
                '&:hover': {
                  borderColor: '#2563eb',
                  backgroundColor: '#eff6ff'
                }
              }}
            >
              Export CSV
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
