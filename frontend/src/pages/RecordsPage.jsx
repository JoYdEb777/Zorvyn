import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import API from '../api/axios';
import DataTable from '../components/DataTable';
import RecordModal from '../components/RecordModal';

export default function RecordsPage() {
  const { canManageRecords } = useAuth();
  const toast = useToast();

  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: '',
    from: '',
    to: '',
    page: 1,
    sort: 'date',
    order: 'desc',
  });

  const toastRef = useRef(toast);
  toastRef.current = toast;

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const res = await API.get('/records', { params });
      setRecords(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toastRef.current.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ type: '', category: '', search: '', from: '', to: '', page: 1, sort: 'date', order: 'desc' });
  };

  const handleCreate = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await API.delete(`/records/${id}`);
      toast.success('Record deleted');
      fetchRecords();
    } catch (err) {
      toast.error('Failed to delete record');
    }
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingRecord) {
        await API.put(`/records/${editingRecord._id}`, data);
        toast.success('Record updated');
      } else {
        await API.post('/records', data);
        toast.success('Record created');
      }
      setModalOpen(false);
      fetchRecords();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Operation failed';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (row) => (
        <span className="mono" style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
          {new Date(row.date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <span className={`badge ${row.type === 'income' ? 'badge-success' : 'badge-danger'}`}>
          {row.type}
        </span>
      ),
    },
    { key: 'category', label: 'Category' },
    {
      key: 'amount',
      label: 'Amount',
      render: (row) => (
        <span className={`amount-cell ${row.type}`}>
          {row.type === 'income' ? '+' : '-'}₹{row.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      style: { maxWidth: '200px' },
      render: (row) => (
        <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-sm)' }}>
          {row.description || '—'}
        </span>
      ),
    },
    ...(canManageRecords
      ? [
          {
            key: 'actions',
            label: 'Actions',
            render: (row) => (
              <div className="actions-cell">
                <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(row)} title="Edit">
                  ✏️
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(row._id)} title="Delete">
                  🗑️
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="records-page">
      <div className="records-header">
        <h1>Financial Records</h1>
        {canManageRecords && (
          <button className="btn btn-primary" onClick={handleCreate} id="create-record-btn">
            + New Record
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search descriptions..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          id="records-search-input"
        />
        <select
          className="form-select"
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          id="records-type-filter"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="date"
          className="form-input"
          value={filters.from}
          onChange={(e) => handleFilterChange('from', e.target.value)}
          placeholder="From"
          id="records-from-filter"
        />
        <input
          type="date"
          className="form-input"
          value={filters.to}
          onChange={(e) => handleFilterChange('to', e.target.value)}
          placeholder="To"
          id="records-to-filter"
        />
        <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-screen" style={{ minHeight: '40vh' }}>
          <div className="spinner spinner-lg"></div>
        </div>
      ) : (
        <>
          <DataTable columns={columns} data={records} emptyMessage="No records found" />

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <span>
                Showing {records.length} of {pagination.total} records
              </span>
              <div className="pagination-buttons">
                <button
                  className="btn btn-outline btn-sm"
                  disabled={filters.page <= 1}
                  onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                >
                  ← Prev
                </button>
                <span className="text-muted" style={{ padding: '0 12px', lineHeight: '32px' }}>
                  {filters.page} / {pagination.pages}
                </span>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={filters.page >= pagination.pages}
                  onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <RecordModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        record={editingRecord}
        loading={submitting}
      />
    </div>
  );
}
