import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import API from '../api/axios';
import DataTable from '../components/DataTable';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const toastRef = useRef(toast);
  toastRef.current = toast;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/users', { params: { page, limit: 20 } });
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toastRef.current.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to update role';
      toast.error(msg);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await API.put(`/users/${userId}/status`, { status: newStatus });
      toast.success('Status updated');
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to update status';
      toast.error(msg);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await API.delete(`/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to delete user';
      toast.error(msg);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || '?';
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (row) => (
        <div className="user-name-cell">
          <div className={`user-avatar ${row.role}`}>
            {getInitials(row.name)}
          </div>
          <div className="user-name-info">
            <div className="name">{row.name}</div>
            <div className="email">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => {
        const isSelf = row._id === currentUser?._id;
        return (
          <select
            className="inline-select"
            value={row.role}
            onChange={(e) => handleRoleChange(row._id, e.target.value)}
            disabled={isSelf}
            title={isSelf ? 'Cannot change your own role' : ''}
          >
            <option value="viewer">Viewer</option>
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        const isSelf = row._id === currentUser?._id;
        return (
          <select
            className="inline-select"
            value={row.status}
            onChange={(e) => handleStatusChange(row._id, e.target.value)}
            disabled={isSelf}
            title={isSelf ? 'Cannot change your own status' : ''}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (row) => (
        <span className="user-date">{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (row) => {
        const isSelf = row._id === currentUser?._id;
        if (isSelf) return <span className="badge badge-info">You</span>;
        return (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => handleDelete(row._id)}
            title="Delete user"
          >
            🗑️
          </button>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="loading-screen" style={{ minHeight: '60vh' }}>
        <div className="spinner spinner-lg"></div>
        <span className="text-muted">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <h1>User Management</h1>
        <span className="badge badge-neutral">{pagination.total} users</span>
      </div>

      <DataTable columns={columns} data={users} emptyMessage="No users found" />

      {pagination.pages > 1 && (
        <div className="pagination">
          <span>Page {page} of {pagination.pages}</span>
          <div className="pagination-buttons">
            <button
              className="btn btn-outline btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            <button
              className="btn btn-outline btn-sm"
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
