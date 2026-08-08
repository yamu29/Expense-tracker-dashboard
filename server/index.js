const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});

// GET all expenses
app.get('/expenses', (req, res) => {
  db.query('SELECT * FROM expenses ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST a new expense
app.post('/expenses', (req, res) => {
  const { title, amount, category, date, notes } = req.body;
  const sql = 'INSERT INTO expenses (title, amount, category, date, notes) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, amount, category, date, notes], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, title, amount, category, date, notes });
  });
});

// PUT (update) an expense
app.put('/expenses/:id', (req, res) => {
  const { title, amount, category, date, notes } = req.body;
  const sql = 'UPDATE expenses SET title=?, amount=?, category=?, date=?, notes=? WHERE id=?';
  db.query(sql, [title, amount, category, date, notes, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Expense updated' });
  });
});

// DELETE an expense
app.delete('/expenses/:id', (req, res) => {
  db.query('DELETE FROM expenses WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Expense deleted' });
  });
});

// GET expense summary by category
app.get('/expenses/summary/category', (req, res) => {
  const sql = 'SELECT category, SUM(amount) as total FROM expenses GROUP BY category';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET total spend
app.get('/expenses/summary/total', (req, res) => {
  const sql = 'SELECT SUM(amount) as total FROM expenses';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});