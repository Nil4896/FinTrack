import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function ExpenseChart({ expenses }) {
  // ✅ Group expenses by month (for Pie chart)
  const monthlyData = useMemo(() => {
    const grouped = {};

    expenses.forEach((e) => {
      if (!e.date || !e.amount) return;
      const date = new Date(e.date);
      if (isNaN(date)) return;

      const month = date.toLocaleString("default", { month: "short" });
      grouped[month] = (grouped[month] || 0) + Number(e.amount);
    });

    const monthOrder = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return Object.entries(grouped)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
  }, [expenses]);

  // ✅ Group expenses by category (for Bar chart)
  const categoryData = useMemo(() => {
    const grouped = {};

    expenses.forEach((e) => {
      if (!e.category || !e.amount) return;
      const cat = e.category;
      grouped[cat] = (grouped[cat] || 0) + Number(e.amount);
    });

    return Object.entries(grouped).map(([category, total]) => ({
      category,
      total,
    }));
  }, [expenses]);

  // 🎨 Shared color palette
  const COLORS = [
    "#2563eb", "#9333ea", "#f97316", "#16a34a",
    "#dc2626", "#0891b2", "#facc15", "#7c3aed",
    "#22d3ee", "#fb923c", "#a855f7", "#84cc16",
  ];

  return (
    <div className="card chart-card">
      {/* 🥧 Pie Chart */}
      <h3 className="chart-title">Monthly Expense Distribution</h3>
      {monthlyData.length === 0 ? (
        <p className="no-data">No expenses yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={monthlyData}
              dataKey="total"
              nameKey="month"
              cx="50%"
              cy="50%"
              outerRadius={110}
              fill="#2563eb"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              isAnimationActive={true}
              animationDuration={800}
            >
              {monthlyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`₹${value}`, "Amount"]}
              contentStyle={{
                background: "var(--white)",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}

      {/* 📊 Bar Chart */}
      <h3 className="chart-title" style={{ marginTop: "2rem" }}>
        Category-wise Expenses
      </h3>
      {categoryData.length === 0 ? (
        <p className="no-data">No category data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-30} textAnchor="end" interval={0} height={70} />
            <YAxis />
            <Tooltip
              formatter={(value) => [`₹${value}`, "Total"]}
              contentStyle={{
                background: "var(--white)",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
