import React, { useState } from "react";
import { api } from "../services/api";

// ✅ Shared categories (must match backend enum)
const categories = [
  "Food & Dining",
  "Transportation",
  "Housing",
  "Bills & Utilities",
  "Shopping",
  "Health & Fitness",
  "Entertainment",
  "Education",
  "Travel",
  "Personal Care",
  "Savings & Investments",
  "Gifts & Donations",
  "Other",
];

function ExpenseItem({ e, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: e.title,
    amount: e.amount,
    category: e.category,
    date: e.date ? new Date(e.date).toISOString().slice(0, 10) : "",
    notes: e.notes || "",
  });

  const save = async () => {
    try {
      const res = await api.put(`/expenses/${e._id}`, {
        ...form,
        amount: Number(form.amount),
      });
      onUpdate(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await api.delete(`/expenses/${e._id}`);
      onDelete(e._id);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (editing) {
    return (
      <div className="expense-card editing">
        <input
          className="input-small"
          value={form.title}
          onChange={(ev) => setForm({ ...form, title: ev.target.value })}
          placeholder="Title"
        />

        <input
          className="input-small"
          type="number"
          value={form.amount}
          onChange={(ev) => setForm({ ...form, amount: ev.target.value })}
          placeholder="Amount"
        />

        {/* ✅ Category Dropdown */}
        <select
          className="input-small"
          value={form.category}
          onChange={(ev) => setForm({ ...form, category: ev.target.value })}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          className="input-small"
          type="date"
          value={form.date}
          onChange={(ev) => setForm({ ...form, date: ev.target.value })}
        />

        <input
          className="input-small"
          value={form.notes}
          onChange={(ev) => setForm({ ...form, notes: ev.target.value })}
          placeholder="Notes"
        />

        <div className="actions">
          <button className="btn btn-success small" onClick={save}>
            Save
          </button>
          <button className="btn small" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="expense-card">
      <div className="expense-info">
        <div className="expense-main">
          <strong>{e.title}</strong>
          <span className="category">{e.category}</span>
        </div>
        <div className="expense-amount">
          ₹{Number(e.amount).toFixed(2)}
          <div className="muted">{new Date(e.date).toLocaleDateString()}</div>
        </div>
      </div>

      {e.notes && <div className="expense-notes">{e.notes}</div>}

      <div className="actions">
        <button className="btn small" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button className="btn btn-danger small" onClick={remove}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default function ExpenseList({ expenses, onUpdate, onDelete }) {
  if (!expenses.length)
    return <div className="card empty-card">No expenses yet</div>;

  return (
    <div className="expense-list">
      <h3 className="expense-heading">Expenses</h3>
      {expenses.map((e) => (
        <ExpenseItem key={e._id} e={e} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}
