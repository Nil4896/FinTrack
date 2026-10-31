import React, { useState } from 'react';
import { api } from '../services/api';

export default function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Other');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // ✅ Category options (must match your backend enum)
  const categories = [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Bills & Utilities',
    'Shopping',
    'Health & Fitness',
    'Entertainment',
    'Education',
    'Travel',
    'Personal Care',
    'Savings & Investments',
    'Gifts & Donations',
    'Other',
  ];

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !amount) {
      setError('Title and amount are required');
      return;
    }

    try {
      const res = await api.post('/expenses', {
        title,
        amount: Number(amount),
        category,
        date: date ? new Date(date) : undefined,
        notes,
      });

      onAdd(res.data);

      // ✅ Reset form fields
      setTitle('');
      setAmount('');
      setCategory('Other');
      setDate('');
      setNotes('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add expense');
    }
  };

  return (
    <form className="expense-form" onSubmit={submit}>
      <h3 className="form-title">Add Expense</h3>

      <div className="form-grid">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
          step="0.01"
        />

        {/* ✅ Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
        />

        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
        />
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button type="submit" className="btn btn-success full-width">
        + Add Expense
      </button>
    </form>
  );
}
