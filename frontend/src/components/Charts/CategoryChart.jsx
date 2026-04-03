import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  '#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#f59e0b',
  '#f43f5e', '#ec4899', '#14b8a6', '#3b82f6', '#ef4444',
];

export default function CategoryChart({ data, type = 'expense' }) {
  const items = data?.[type] || [];

  if (items.length === 0) {
    return <div className="empty-state"><p className="text-muted">No category data</p></div>;
  }

  const chartData = {
    labels: items.map((d) => d.category),
    datasets: [
      {
        data: items.map((d) => d.total),
        backgroundColor: COLORS.slice(0, items.length),
        borderColor: '#111827',
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 12,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1a2235',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            return `${ctx.label}: ₹${ctx.parsed.toLocaleString()} (${pct}%)`;
          },
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}
