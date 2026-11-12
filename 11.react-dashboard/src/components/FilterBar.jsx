import React from 'react';
import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  InputAdornment,
  Typography
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import { CATEGORIES, ORDER_STATUSES, STATUS_COLORS } from '../data/mockOrders';

export function FilterBar({ filters, onFilterChange, onResetFilters }) {
  const hasActiveFilter =
    filters.dateRange !== 'all' ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.search.trim() !== '';

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" sx={{ color: '#0f172a' }}>
            Filter Analytics &amp; Orders
          </Typography>
        </Box>
        {hasActiveFilter && (
          <Button
            size="small"
            startIcon={<RestartAltIcon />}
            onClick={onResetFilters}
            color="secondary"
          >
            Reset Filters
          </Button>
        )}
      </Box>

      <Grid container spacing={2} alignItems="center">
        {/* Search Input */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Search Order / Customer / Product"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Date Range Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="date-range-label">Date Range</InputLabel>
            <Select
              labelId="date-range-label"
              value={filters.dateRange}
              label="Date Range"
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Category Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={filters.category}
              label="Category"
              onChange={(e) => onFilterChange('category', e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Order Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={filters.status}
              label="Order Status"
              onChange={(e) => onFilterChange('status', e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {ORDER_STATUSES.map((st) => (
                <MenuItem key={st} value={st}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: STATUS_COLORS[st].chartColor
                      }}
                    />
                    <span>{st}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Custom Start / End Date inputs when 'custom' is chosen */}
        {filters.dateRange === 'custom' && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="From Date"
                value={filters.startDate}
                onChange={(e) => onFilterChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="To Date"
                value={filters.endDate}
                onChange={(e) => onFilterChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
}

export default FilterBar;
