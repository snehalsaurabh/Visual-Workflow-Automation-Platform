const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database setup
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS workflows (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            nodes TEXT,
            edges TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Routes
app.get('/api/workflows', (req, res) => {
    db.all('SELECT id, name, updated_at FROM workflows ORDER BY updated_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/api/workflows/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM workflows WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Workflow not found' });
        }
        res.json({
            ...row,
            nodes: JSON.parse(row.nodes),
            edges: JSON.parse(row.edges)
        });
    });
});

app.post('/api/workflows', (req, res) => {
    const { name, nodes, edges } = req.body;

    if (!nodes || !edges) {
        return res.status(400).json({ error: 'Nodes and edges are required' });
    }

    const query = `INSERT INTO workflows (name, nodes, edges) VALUES (?, ?, ?)`;
    const params = [name || 'Untitled Workflow', JSON.stringify(nodes), JSON.stringify(edges)];

    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: 'Workflow saved successfully' });
    });
});

// Update workflow (optional, but good to have)
app.put('/api/workflows/:id', (req, res) => {
    const { id } = req.params;
    const { name, nodes, edges } = req.body;

    const query = `UPDATE workflows SET name = ?, nodes = ?, edges = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const params = [name, JSON.stringify(nodes), JSON.stringify(edges), id];

    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Workflow not found' });
        }
        res.json({ message: 'Workflow updated successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
