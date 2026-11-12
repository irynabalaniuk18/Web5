
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

// Отримання та відображення завдань
async function loadTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();

    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = task.title;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Видалити';

        deleteButton.addEventListener('click', () => {
            deleteTask(task.id);
        });

        li.appendChild(span);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

// Додавання нового завдання
async function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        alert('Введіть назву завдання!');
        return;
    }

    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title })
    });

    if (response.ok) {
        taskInput.value = '';
        loadTasks();
    } else {
        alert('Не вдалося додати завдання');
    }
}

// Видалення завдання
async function deleteTask(id) {
    const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        loadTasks();
    } else {
        alert('Не вдалося видалити завдання');
    }
}

// Обробник кнопки додавання
addButton.addEventListener('click', addTask);

// Завантаження завдань при відкритті сторінки
loadTasks();
