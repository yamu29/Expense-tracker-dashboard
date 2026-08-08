import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: '', amount: '', category: 'Food', date: '', notes: ''
  });

  const fetchExpenses = () => {
    fetch('http://localhost:5000/expenses')
      .then(res => res.json())
      .then(data => setExpenses(data));
  };

  useEffect(() => {
    fetchExpenses();
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
        fetchExpenses();
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/expenses/${id}`, { method: 'DELETE' })
      .then(() => fetchExpenses());
  };

  return (
    <div className="App">
      <h1>Expense Tracker</h1>

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