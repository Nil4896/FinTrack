import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for redirect after logout
import { api, setAuthToken } from "../services/api";
import { useAuth } from "../utils/auth";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";

export default function Dashboard() {
  const { token, setToken, user, setUser } = useAuth();
  const navigate = useNavigate(); // ✅ navigation hook
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch user and expenses data
  useEffect(() => {
    if (token) setAuthToken(token);

    const fetchData = async () => {
      try {
        const me = await api.get("/user");
        setUser(me.data);

        const res = await api.get("/expenses");
        setExpenses(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);

        // ✅ Auto logout if token is invalid or expired
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token, setUser]);

  // ✅ Logout Function
  const logout = () => {
    try {
      // 1️⃣ Clear auth data
      setToken(null);
      setAuthToken(null);
      localStorage.removeItem("token");

      // 2️⃣ Clear user data
      setUser(null);

      // 3️⃣ Redirect to login page
      navigate("/login");

      // 4️⃣ Optional — reset app state completely
      window.location.reload();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ✅ Handlers for expense CRUD operations
  const addExpense = (expense) => setExpenses((prev) => [expense, ...prev]);
  const updateExpense = (updated) =>
    setExpenses((prev) =>
      prev.map((e) => (e._id === updated._id ? updated : e))
    );
  const deleteExpense = (id) =>
    setExpenses((prev) => prev.filter((e) => e._id !== id));

  // ✅ Loading Screen
  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="dashboard-page fade-in">
      {/* ===== Header ===== */}
      <header className="dashboard-header">
        <h1 className="logo">FinTrack</h1>
        <div className="user-section">
          <span className="username">👋 {user?.name}</span>
          <button className="btn logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="dashboard-content">
        {/* Expense Section */}
        <div className="expense-section">
          <ExpenseForm onAdd={addExpense} />
          <ExpenseList
            expenses={expenses}
            onUpdate={updateExpense}
            onDelete={deleteExpense}
          />
        </div>

        {/* Charts Section */}
        <div className="chart-section">
          <ExpenseChart expenses={expenses} />
        </div>
      </main>
    </div>
  );
}
