import React, { useState } from 'react';
import PieChart from './PieChart';
import BarChart from './BarChart';
import LineChart from './LineChart';
import { IconPieChart, IconBarChart, IconLineChart } from '../Icons';

export default function ChartsSection({ transactions = [] }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pie', 'bar', 'line'

  return (
    <section className="charts-section-wrapper">
      <div className="charts-tab-header">
        <div className="charts-heading-box">
          <h2 className="section-title">Visual Analytics & Trends</h2>
          <p className="section-subtitle">Comprehensive breakdown of spending habits, income flows, and daily patterns</p>
        </div>

        <div className="charts-nav-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Charts
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'pie' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('pie')}
          >
            <IconPieChart size={15} /> Categories
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'bar' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('bar')}
          >
            <IconBarChart size={15} /> Income vs Expense
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'line' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('line')}
          >
            <IconLineChart size={15} /> Daily Trend
          </button>
        </div>
      </div>

      <div className="charts-grid-layout">
        {(activeTab === 'all' || activeTab === 'pie') && (
          <div className="chart-grid-col col-pie">
            <PieChart transactions={transactions} />
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'bar') && (
          <div className="chart-grid-col col-bar">
            <BarChart transactions={transactions} />
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'line') && (
          <div className="chart-grid-col col-line">
            <LineChart transactions={transactions} />
          </div>
        )}
      </div>
    </section>
  );
}

