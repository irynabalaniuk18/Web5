
const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

// Підключення бази даних
const db = new Database(path.join(__dirname, 'tasks.db'));

// Створення таблиці завдань
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL
    )
`);

// Налаштування сервера
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Головна сторінка
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Отримання всіх завдань
app.get('/api/tasks', (req, res) => {
    try {
        const tasks = db.prepare('SELECT * FROM tasks ORDER BY id DESC').all();
        res.json(tasks);
    } catch (error) {
        console.error('Помилка отримання завдань:', error);
        res.status(500).json({ error: 'Не вдалося отримати завдання' });
    }
});

// Додавання нового завдання
app.post('/api/tasks', (req, res) => {
    console.log('Отримано запит:', req.body);

    const { title } = req.body || {};

    if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Введіть назву завдання' });
    }

    try {
        const result = db.prepare(
            'INSERT INTO tasks (title) VALUES (?)'
        ).run(title.trim());

        const task = db.prepare(
            'SELECT * FROM tasks WHERE id = ?'
        ).get(result.lastInsertRowid);

        res.status(201).json(task);
    } catch (error) {
        console.error('Помилка додавання:', error);
        res.status(500).json({ error: 'Помилка бази даних' });
    }
});

// Видалення завдання
app.delete('/api/tasks/:id', (req, res) => {
    try {
        const result = db.prepare(
            'DELETE FROM tasks WHERE id = ?'
        ).run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Завдання не знайдено' });
        }

        res.json({ message: 'Завдання видалено' });
    } catch (error) {
        console.error('Помилка видалення:', error);
        res.status(500).json({ error: 'Не вдалося видалити завдання' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено: http://localhost:${PORT}`);
});
