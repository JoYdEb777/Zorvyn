import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import API from '../api/axios';
import StatsCard from '../components/StatsCard';
import TrendChart from '../components/Charts/TrendChart';
import CategoryChart from '../components/Charts/CategoryChart';
import IncomeExpenseChart from '../components/Charts/IncomeExpenseChart';

function formatCurrency(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString()}`;
}

export default function DashboardPage() {
  const { canViewAnalytics } = useAuth();
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [categories, setCategories] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryRes, recentRes] = await Promise.all([
        API.get('/dashboard/summary'),
        API.get('/dashboard/recent'),
      ]);
      setSummary(summaryRes.data.data);
      setRecent(recentRes.data.data);

      if (canViewAnalytics) {
        const [trendsRes, catRes] = await Promise.all([
          API.get('/dashboard/trends'),
          API.get('/dashboard/category-breakdown'),
        ]);
        setTrends(trendsRes.data.data);
        setCategories(catRes.data.data);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [canViewAnalytics]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '60vh' }}>
        <div className="spinner spinner-lg"></div>
        <span className="text-muted">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Financial overview at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          label="Total Income"
          value={formatCurrency(summary?.totalIncome || 0)}
          icon="💰"
          type="income"
        />
        <StatsCard
          label="Total Expenses"
          value={formatCurrency(summary?.totalExpense || 0)}
          icon="💸"
          type="expense"
        />
        <StatsCard
          label="Net Balance"
          value={formatCurrency(summary?.netBalance || 0)}
          icon="📈"
          type="balance"
        />
        <StatsCard
          label="Total Records"
          value={summary?.totalRecords?.toLocaleString() || '0'}
          icon="📋"
          type="records"
        />
      </div>

      {/* Charts */}
      {canViewAnalytics && (
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-card-title">Monthly Trends</div>
            <div className="chart-wrapper">
              <TrendChart data={trends} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-title">Income vs Expense</div>
            <div className="chart-wrapper">
              <IncomeExpenseChart data={trends} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-card-title">Expense by Category</div>
            <div className="chart-wrapper">
              <CategoryChart data={categories} type="expense" />
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="recent-section">
        <h2>Recent Activity</h2>
        <div className="recent-list">
          {recent.length === 0 ? (
            <div className="empty-state">
              <p className="text-muted">No recent transactions</p>
            </div>
          ) : (
            recent.map((record) => (
              <div key={record._id} className="recent-item">
                <div className={`recent-item-icon ${record.type}`}>
                  {record.type === 'income' ? '↗' : '↘'}
                </div>
                <div className="recent-item-info">
                  <div className="recent-item-desc">
                    {record.description || record.category}
                  </div>
                  <div className="recent-item-meta">
                    <span>{record.category}</span>
                    <span>•</span>
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className={`recent-item-amount ${record.type}`}>
                  {record.type === 'income' ? '+' : '-'}₹{record.amount.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
