const apiBase = 'http://localhost:8080/tasks';

function showSection(sectionId) {
    document.querySelectorAll('section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`${sectionId}-section`).classList.add('active');
    if(sectionId === 'list') loadTasks();
    if(sectionId === 'search') {
        document.getElementById('search-input').value = '';
        document.getElementById('search-result').innerHTML = '';
    }
}

const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResult = document.getElementById('search-result');

function renderTasks(tasks, container) {
    container.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = '';
        if(task.status === 'COMPLETED') li.classList.add('completed');
        else if(task.status === 'IN_PROGRESS') li.classList.add('in-progress');

        li.innerHTML = `
              <div class="task-info">
                <strong>${task.title}</strong><br/>
                <em>${task.description || ''}</em>
              </div>
              <div class="task-actions">
                <select class="status-select" aria-label="Change status for ${task.title}">
                  <option disabled selected>${task.status}</option>
                  ${
            {
                PENDING: ['IN_PROGRESS', 'COMPLETED'],
                IN_PROGRESS: ['COMPLETED'],
                COMPLETED: []
            }[task.status].map(s => `<option value="${s}">${s}</option>`).join('')
        }
                </select>
                <button class="delete-btn" aria-label="Delete task ${task.title}">X</button>
              </div>
            `;

        li.querySelector('.status-select').addEventListener('change', e => {
            const select = e.target;
            li.style.transition = 'background-color 0.4s ease';
            li.style.backgroundColor = '#dff0d8'; // verde claro
            setTimeout(() => li.style.backgroundColor = '', 700);

            updateStatus(task.id, select.value);
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            if(confirm('Are you sure you want to delete this task?')) {
                li.classList.add('removing');
                li.addEventListener('animationend', () => {
                    deleteTask(task.id);
                }, {once: true});
            }
        });

        container.appendChild(li);
    });
}

function loadTasks() {
    fetch(apiBase)
        .then(res => res.json())
        .then(tasks => renderTasks(tasks, taskList))
        .catch(err => console.error('Error loading tasks:', err));
}

taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    if(!title) {
        alert('Title is mandatory.');
        return;
    }
    fetch(apiBase, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, description})
    })
        .then(res => {
            if(!res.ok) return res.text().then(msg => {throw new Error(msg)});
            return res.json();
        })
        .then(() => {
            titleInput.value = '';
            descriptionInput.value = '';
            showSection('list');
        })
        .catch(err => alert('Error creating task: ' + err.message));
});

function updateStatus(id, newStatus) {
    fetch(`${apiBase}/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ status: newStatus })
    })
        .then(res => {
            if(!res.ok) return res.text().then(msg => {throw new Error(msg)});
            return res.json();
        })
        .then(() => loadTasks())
        .catch(err => alert('Error updating task: ' + err.message));
}

function deleteTask(id) {
    fetch(`${apiBase}/${id}`, { method: 'DELETE' })
        .then(res => {
            if(!res.ok) return res.text().then(msg => {throw new Error(msg)});
            return res.text();
        })
        .then(() => loadTasks())
        .catch(err => alert('Error deleting task: ' + err.message));
}

async function searchTasks(query) {
    searchResult.innerHTML = '';
    if(!query) {
        alert('Type a term to search.');
        return;
    }

    let tasks = [];

    if(!isNaN(query)) {
        try {
            const res = await fetch(`${apiBase}/${query}`);
            if(res.ok) {
                const task = await res.json();
                tasks = [task];
            } else {
                alert('No task found with that ID');
            }
        } catch {
            alert('Error fetching task by ID');
        }
    } else {
        try {
            const res = await fetch(`${apiBase}/search?title=${encodeURIComponent(query)}`);
            if(res.ok) {
                tasks = await res.json();
                if(tasks.length === 0) alert('No tasks found with that title');
            } else {
                alert('Error searching tasks');
            }
        } catch {
            alert('Error fetching tasks by title');
        }
    }

    if(tasks.length === 0) {
        searchResult.innerHTML = '<li>No tasks found.</li>';
    } else {
        renderTasks(tasks, searchResult);
    }
}

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    searchTasks(query);
});

loadTasks();