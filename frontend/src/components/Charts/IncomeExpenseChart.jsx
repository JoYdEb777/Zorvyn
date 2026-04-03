import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function IncomeExpenseChart({ data }) {
  if (!data || data.length === 0) return <div className="empty-state"><p className="text-muted">No comparison data</p></div>;

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: 'Income',
        data: data.map((d) => d.income),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Expense',
        data: data.map((d) => d.expense),
        backgroundColor: 'rgba(244, 63, 94, 0.7)',
        borderColor: '#f43f5e',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
          pointStyle: 'rectRounded',
          padding: 20,
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
          label: (ctx) => `${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: (v) => `₹${(v / 1000).toFixed(0)}k`,
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
