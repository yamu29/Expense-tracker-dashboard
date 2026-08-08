import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './App.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#FF6699', '#A28DFF'];

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    title: '', amount: '', category: 'Food', date: '', notes: ''
  });

  const fetchExpenses = () => {
    fetch('http://localhost:5000/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data));
  };

  const fetchSummary = () => {
    fetch('http://localhost:5000/expenses/summary/category')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          category: item.category,
          total: parseFloat(item.total)
        }));
        setCategoryData(formatted);
      });

    fetch('http://localhost:5000/expenses/summary/total')
      .then(res => res.json())
      .then(data => setTotal(data.total || 0));
  };

  const refreshAll = () => {
    fetchExpenses();
    fetchSummary();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    refreshAll();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        setForm({ title: '', amount: '', category: 'Food', date: '', notes: '' });
        refreshAll();
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/expenses/${id}`, { method: 'DELETE' })
      .then(() => refreshAll());
  };

  return (
    <div className="App">
      <h1>Expense Tracker</h1>

      <div className="dashboard">
        <div className="summary-card">
          <h3>Total Spend</h3>
          <p className="total-amount">₹{total}</p>
        </div>

        <div className="chart-card">
          <h3>Spend by Category</h3>
          {categoryData.length > 0 ? (
            <PieChart width={300} height={250}>
              <Pie
                data={categoryData}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                isAnimationActive={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <p>No data yet</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange}>
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Health</option>
          <option>Other</option>
        </select>
        <input name="date" type="date" value={form.date} onChange={handleChange} required />
        <input name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} />
        <button type="submit">Add Expense</button>
      </form>

      <h2>All Expenses</h2>
      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {exp.title} - ₹{exp.amount} ({exp.category}) on {exp.date.split('T')[0]}
            <button onClick={() => handleDelete(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;