/*
/!*
document.addEventListener("DOMContentLoaded", function () {
    const taskList = document.getElementById("task-list");
    const taskForm = document.getElementById("task-form");
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");


    function fetchTasks() {
        fetch("http://localhost:8080/tasks")
            .then(response => response.json())
            .then(tasks => renderTasks(tasks))
            .catch(error => console.error("Error loading tasks:", error));
    }


    function renderTasks(tasks) {
        taskList.innerHTML = "";
        tasks.forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.classList.add("task");

            taskElement.innerHTML = `
        <strong>${task.title}</strong> - <em>${task.description}</em>
        <span class="${task.status}">${task.status}</span>
        <button class="delete-btn">X</button>
      `;


            taskElement.addEventListener("click", function (e) {
                if (e.target.classList.contains("delete-btn")) return;

                if (task.status === "PENDING") {
                    const newStatus = task.status === "PENDING" ? "IN_PROGRESS"
                        : task.status === "IN_PROGRESS" ? "COMPLETED"
                            : "COMPLETED";

                    updateTaskStatus(task.id, newStatus);
                } else {
                    alert("Only tasks with status PENDING can be updated.");
                }
            });


            taskElement.querySelector(".delete-btn").addEventListener("click", function () {
                deleteTask(task.id);
            });

            taskList.appendChild(taskElement);
        });
    }


    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const task = {
            title: titleInput.value,
            description: descriptionInput.value
        };

        fetch("http://localhost:8080/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        })
            .then(response => {
                if (!response.ok) return response.text().then(msg => { throw new Error(msg); });
                return response.json();
            })
            .then(() => {
                titleInput.value = "";
                descriptionInput.value = "";
                fetchTasks();
            })
            .catch(error => alert("Error creating task: " + error.message));
    });


    function updateTaskStatus(id, newStatus) {
        fetch(`http://localhost:8080/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        })
            .then(response => {
                if (!response.ok) return response.text().then(msg => { throw new Error(msg); });
                return response.json();
            })
            .then(() => fetchTasks())
            .catch(error => alert("Error in task update: " + error.message));
    }

    function deleteTask(id) {
        fetch(`http://localhost:8080/tasks/${id}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) return response.text().then(msg => { throw new Error(msg); });
                return response.text();
            })
            .then(() => fetchTasks())
            .catch(error => alert("Error deleting task: " + error.message));
    }


    fetchTasks();

    /!*async function searchTask() {
        const term = document.getElementById('search-input').value.trim();
        const container = document.getElementById('search-result');
        container.innerHTML = '';

        if (!term) {
            alert('Type a term to search.');
            return;
        }

        const all = await fetchTasks();

        const filtered = all.filter(task =>
            task.title.toLowerCase().includes(term.toLowerCase()) || task.id.toString() === term
        );

        if (filtered.length === 0) {
            container.innerHTML = '<p>No tasks found.</p>';
        } else {
            const ul = document.createElement('ul');
            ul.id = 'result-list';
            container.appendChild(ul);
            renderTasks(filtered, 'result-list');
        }
    }*!/

    async function searchTasks(query) {
        const container = document.getElementById('search-result');
        container.innerHTML = '';

        if (!query) {
            alert('Type a term to search.');
            return;
        }

        let tasks = [];

        if (!isNaN(query)) {
            // Busca por ID
            try {
                const res = await fetch(`${apiBase}/${query}`);
                if (res.ok) {
                    const task = await res.json();
                    tasks = [task];
                } else {
                    alert("No task found with that ID");
                }
            } catch (err) {
                alert("Error fetching task by ID");
            }
        } else {
            // Busca por título
            try {
                const res = await fetch(`${apiBase}/search?title=${encodeURIComponent(query)}`);
                if (res.ok) {
                    tasks = await res.json();
                    if (tasks.length === 0) {
                        alert("No tasks found with that title");
                    }
                } else {
                    alert("Error searching tasks");
                }
            } catch (err) {
                alert("Error fetching tasks by title");
            }
        }

        if (tasks.length === 0) {
            container.innerHTML = '<p>No tasks found.</p>';
        } else {
            const ul = document.createElement('ul');
            ul.id = 'result-list';
            container.appendChild(ul);
            renderTasks(tasks, 'result-list');
        }
    }


});
*!/

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
const messageBox = document.getElementById('message-box');

function showUserMessage(msg, type = 'error', duration = 4000) {
    messageBox.textContent = msg;
    messageBox.className = '';
    messageBox.classList.add(type === 'success' ? 'success' : 'error', 'show');
    clearTimeout(messageBox._timeout);
    messageBox._timeout = setTimeout(() => {
        messageBox.classList.remove('show');
    }, duration);
}

function renderTasks(tasks, container) {
    container.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = '';
        if(task.status === 'COMPLETED') li.classList.add('completed');
        else if(task.status === 'IN_PROGRESS') li.classList.add('in-progress');

        li.innerHTML = `
      <strong>${task.title}</strong><br/>
      <em>${task.description || ''}</em>
      <br/>
      <select class="status-select">
        <option disabled selected>${task.status}</option>
        ${{
            PENDING: ['IN_PROGRESS', 'COMPLETED'],
            IN_PROGRESS: ['COMPLETED'],
            COMPLETED: []
        }[task.status].map(s => `<option value="${s}">${s}</option>`).join('')}
      </select>
      <button class="delete-btn">X</button>
    `;

        li.querySelector('.status-select').addEventListener('change', e => {
            updateStatus(task.id, e.target.value);
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTask(task.id);
        });

        container.appendChild(li);
    });
}

function loadTasks() {
    fetch(apiBase)
        .then(res => res.json())
        .then(tasks => renderTasks(tasks, taskList))
        .catch(err => {
            console.error('Error loading tasks:', err);
            showUserMessage('Error loading tasks. Please try reloading the page.');
        });
}

taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    if(!title) {
        showUserMessage('Title is required.');
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
            showUserMessage('Task created successfully!', 'success');
        })
        .catch(err => {
            console.error(err);
            showUserMessage('Error creating task. Please try again.');
        });
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
        .then(() => {
            loadTasks();
            showUserMessage('Status updated successfully!', 'success');
        })
        .catch(err => {
            console.error(err);
            showUserMessage('Error updating status. Please try again.');
        });
}

function deleteTask(id) {
    if(!confirm('Are you sure you want to delete this task?')) return;
    fetch(`${apiBase}/${id}`, { method: 'DELETE' })
        .then(res => {
            if(!res.ok) return res.text().then(msg => {throw new Error(msg)});
            return res.text();
        })
        .then(() => {
            loadTasks();
            showUserMessage('Task deleted successfully!', 'success');
        })
        .catch(err => {
            console.error(err);
            showUserMessage('Error deleting task. Please try again.');
        });
}

async function searchTasks(query) {
    searchResult.innerHTML = '';
    if(!query) {
        showUserMessage('Please type a term to search.');
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
                showUserMessage('No task found with that ID.');
            }
        } catch {
            showUserMessage('Error fetching task by ID.');
        }
    } else {
        try {
            const res = await fetch(`${apiBase}/search?title=${encodeURIComponent(query)}`);
            if(res.ok) {
                tasks = await res.json();
                if(tasks.length === 0) showUserMessage('No tasks found with that title.');
            } else {
                showUserMessage('Error searching tasks.');
            }
        } catch {
            showUserMessage('Error searching tasks.');
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

// Load task list on page load
loadTasks();
*/

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
            // Efeito temporário de highlight
            li.style.transition = 'background-color 0.4s ease';
            li.style.backgroundColor = '#dff0d8'; // verde claro
            setTimeout(() => li.style.backgroundColor = '', 700);

            updateStatus(task.id, select.value);
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            if(confirm('Are you sure you want to delete this task?')) {
                // Animação antes de remover do DOM
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