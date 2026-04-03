import { useState, useEffect } from 'react';

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Rental Income', 'Bonus', 'Consulting', 'Other'],
  expense: ['Rent', 'Utilities', 'Software', 'Marketing', 'Salaries', 'Office Supplies', 'Travel', 'Insurance', 'Equipment', 'Training', 'Other'],
};

export default function RecordModal({ isOpen, onClose, onSubmit, record, loading }) {
  const [form, setForm] = useState({
    amount: '',
    type: 'income',
    category: '',
    date: '',
    description: '',
  });

  useEffect(() => {
    if (record) {
      setForm({
        amount: record.amount || '',
        type: record.type || 'income',
        category: record.category || '',
        date: record.date ? record.date.split('T')[0] : '',
        description: record.description || '',
      });
    } else {
      setForm({ amount: '', type: 'income', category: '', date: new Date().toISOString().split('T')[0], description: '' });
    }
  }, [record, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    onSubmit({
      ...form,
      amount: parseFloat(form.amount),
    });
  };

  const categories = CATEGORIES[form.type] || [];
  const isEditing = !!record;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Record' : 'New Record'}</h2>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                name="type"
                className="form-select"
                value={form.type}
                onChange={handleChange}
                id="record-type-select"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                className="form-input"
                placeholder="Enter amount"
                value={form.amount}
                onChange={handleChange}
                min="1"
                step="0.01"
                required
                id="record-amount-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={form.category}
                onChange={handleChange}
                required
                id="record-category-select"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={form.date}
                onChange={handleChange}
                required
                id="record-date-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description (optional)</label>
              <input
                type="text"
                name="description"
                className="form-input"
                placeholder="Brief description..."
                value={form.description}
                onChange={handleChange}
                maxLength="500"
                id="record-description-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${form.type === 'income' ? 'btn-primary' : 'btn-danger'}`}
              disabled={loading}
              id="record-submit-btn"
            >
              {loading && <span className="spinner"></span>}
              {isEditing ? 'Update' : 'Create'} Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
