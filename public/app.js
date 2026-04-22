// ===== API CONFIG =====
const API = window.location.origin;
let token = localStorage.getItem('token');
let userName = localStorage.getItem('userName');

// ===== API HELPER =====
async function api(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// ===== TOAST =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ===== AUTH =====
const authScreen = document.getElementById('auth-screen');
const dashboardScreen = document.getElementById('dashboard-screen');

// Tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
    document.getElementById('auth-error').classList.add('hidden');
  });
});

function showError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.classList.remove('hidden');
}

// Register
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('register-btn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Creating...';

  try {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });

    // Auto-login after register
    const loginData = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    token = loginData.token;
    userName = name;
    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);
    showDashboard();
    showToast('Account created successfully!');
  } catch (err) {
    showError(err.message);
  } finally {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Create Account';
  }
});

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Signing in...';

  try {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    token = data.token;
    // Decode JWT to get user name
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userName = payload.name || email.split('@')[0];
    } catch { userName = email.split('@')[0]; }

    localStorage.setItem('token', token);
    localStorage.setItem('userName', userName);
    showDashboard();
    showToast('Welcome back!');
  } catch (err) {
    showError(err.message);
  } finally {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Sign In';
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  token = null;
  userName = null;
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
  dashboardScreen.classList.remove('active');
  authScreen.classList.add('active');
});

// ===== DASHBOARD =====
function showDashboard() {
  authScreen.classList.remove('active');
  dashboardScreen.classList.add('active');
  document.getElementById('user-greeting').textContent = `Hello, ${userName || 'Student'}`;
  loadAll();
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`${btn.dataset.section}-section`).classList.add('active');
  });
});

// ===== DATA =====
let subjects = [];
let tasks = [];
let sessions = [];

async function loadAll() {
  await Promise.all([loadSubjects(), loadTasks(), loadSessions()]);
  updateStats();
}

// ===== SUBJECTS =====
async function loadSubjects() {
  try {
    subjects = await api('/api/subjects');
    renderSubjects();
    populateSubjectDropdowns();
  } catch (err) {
    console.error('Load subjects error:', err);
  }
}

function renderSubjects() {
  const list = document.getElementById('subjects-list');
  if (subjects.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
        <p>No subjects yet. Add your first subject to get started!</p>
      </div>`;
    return;
  }

  const colors = ['#6C63FF', '#4ECDC4', '#FF6B6B', '#FFD93D', '#74b9ff', '#a29bfe', '#fd79a8', '#00cec9'];
  list.innerHTML = subjects.map((s, i) => `
    <div class="subject-card" data-id="${s._id}">
      <span class="subject-name">
        <span class="subject-dot" style="background: ${colors[i % colors.length]}"></span>
        ${s.name}
      </span>
      <button class="btn btn-danger" onclick="deleteSubject('${s._id}')">Delete</button>
    </div>
  `).join('');
}

function populateSubjectDropdowns() {
  const options = '<option value="">Select subject</option>' +
    subjects.map(s => `<option value="${s._id}">${s.name}</option>`).join('');
  document.getElementById('task-subject-select').innerHTML = options;
  document.getElementById('session-subject-select').innerHTML = options;
}

// Add subject
document.getElementById('add-subject-btn').addEventListener('click', () => {
  document.getElementById('add-subject-form').classList.remove('hidden');
  document.getElementById('subject-name-input').focus();
});

document.getElementById('cancel-subject-btn').addEventListener('click', () => {
  document.getElementById('add-subject-form').classList.add('hidden');
  document.getElementById('subject-name-input').value = '';
});

document.getElementById('save-subject-btn').addEventListener('click', async () => {
  const name = document.getElementById('subject-name-input').value.trim();
  if (!name) return;

  try {
    await api('/api/subjects', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
    document.getElementById('subject-name-input').value = '';
    document.getElementById('add-subject-form').classList.add('hidden');
    await loadSubjects();
    updateStats();
    showToast('Subject added!');
  } catch (err) {
    showToast(err.message, 'error');
  }
});

// Enter key support for subject input
document.getElementById('subject-name-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('save-subject-btn').click();
});

async function deleteSubject(id) {
  try {
    await api(`/api/subjects/${id}`, { method: 'DELETE' });
    await loadSubjects();
    updateStats();
    showToast('Subject deleted');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ===== TASKS =====
async function loadTasks() {
  try {
    tasks = await api('/api/tasks');
    renderTasks();
  } catch (err) {
    console.error('Load tasks error:', err);
  }
}

function renderTasks() {
  const list = document.getElementById('tasks-list');
  if (tasks.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        <p>No tasks yet. Create a task to start tracking your work!</p>
      </div>`;
    return;
  }

  list.innerHTML = tasks.map(t => {
    const subject = subjects.find(s => s._id === t.subjectId);
    const deadline = t.deadline ? new Date(t.deadline).toLocaleDateString() : '';
    const isCompleted = t.status === 'completed';

    return `
      <div class="task-card" data-id="${t._id}">
        <div class="task-info">
          <div class="task-title">${t.title}</div>
          <div class="task-meta">
            ${subject ? `<span>📚 ${subject.name}</span>` : ''}
            ${t.description ? `<span>${t.description}</span>` : ''}
            ${deadline ? `<span>📅 ${deadline}</span>` : ''}
            <span class="status-badge ${isCompleted ? 'status-completed' : 'status-pending'}">${t.status}</span>
          </div>
        </div>
        <div class="task-actions">
          ${!isCompleted ? `<button class="btn btn-success" onclick="completeTask('${t._id}')">✓ Done</button>` : ''}
          <button class="btn btn-danger" onclick="deleteTask('${t._id}')">Delete</button>
        </div>
      </div>`;
  }).join('');
}

// Add task
document.getElementById('add-task-btn').addEventListener('click', () => {
  document.getElementById('add-task-form').classList.remove('hidden');
  document.getElementById('task-title-input').focus();
});

document.getElementById('cancel-task-btn').addEventListener('click', () => {
  document.getElementById('add-task-form').classList.add('hidden');
  clearTaskForm();
});

document.getElementById('save-task-btn').addEventListener('click', async () => {
  const title = document.getElementById('task-title-input').value.trim();
  if (!title) return;

  const body = {
    title,
    description: document.getElementById('task-desc-input').value.trim() || undefined,
    subjectId: document.getElementById('task-subject-select').value || undefined,
    deadline: document.getElementById('task-deadline-input').value || undefined
  };

  try {
    await api('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    document.getElementById('add-task-form').classList.add('hidden');
    clearTaskForm();
    await loadTasks();
    updateStats();
    showToast('Task created!');
  } catch (err) {
    showToast(err.message, 'error');
  }
});

function clearTaskForm() {
  document.getElementById('task-title-input').value = '';
  document.getElementById('task-desc-input').value = '';
  document.getElementById('task-subject-select').value = '';
  document.getElementById('task-deadline-input').value = '';
}

async function completeTask(id) {
  try {
    await api(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'completed' })
    });
    await loadTasks();
    updateStats();
    showToast('Task completed! 🎉');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteTask(id) {
  try {
    await api(`/api/tasks/${id}`, { method: 'DELETE' });
    await loadTasks();
    updateStats();
    showToast('Task deleted');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ===== SESSIONS =====
async function loadSessions() {
  try {
    sessions = await api('/api/sessions');
    renderSessions();
  } catch (err) {
    console.error('Load sessions error:', err);
  }
}

function renderSessions() {
  const list = document.getElementById('sessions-list');
  if (sessions.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <p>No sessions yet. Start a study session to track your time!</p>
      </div>`;
    return;
  }

  list.innerHTML = sessions.map(s => {
    const subject = subjects.find(sub => sub._id === s.subjectId);
    const start = new Date(s.startTime).toLocaleString();
    const isActive = !s.endTime;
    const duration = s.duration ? formatDuration(s.duration) : (isActive ? 'In progress...' : '');

    return `
      <div class="session-card" data-id="${s._id}">
        <div class="session-info">
          <div class="task-title">${subject ? subject.name : 'Study'} Session</div>
          <div class="session-meta">
            <span>🕐 Started: ${start}</span>
            ${duration ? `<span>⏱ ${duration}</span>` : ''}
            <span class="status-badge ${isActive ? 'status-active' : 'status-ended'}">${isActive ? 'Active' : 'Ended'}</span>
          </div>
        </div>
        <div class="session-actions">
          ${isActive ? `<button class="btn btn-success" onclick="endSession('${s._id}')">⏹ End</button>` : ''}
        </div>
      </div>`;
  }).join('');
}

function formatDuration(mins) {
  if (mins < 60) return `${Math.round(mins)} min`;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return `${h}h ${m}m`;
}

// Start session
document.getElementById('start-session-btn').addEventListener('click', () => {
  document.getElementById('start-session-form').classList.remove('hidden');
});

document.getElementById('cancel-session-btn').addEventListener('click', () => {
  document.getElementById('start-session-form').classList.add('hidden');
  document.getElementById('session-subject-select').value = '';
});

document.getElementById('save-session-btn').addEventListener('click', async () => {
  const subjectId = document.getElementById('session-subject-select').value;
  if (!subjectId) {
    showToast('Please select a subject', 'error');
    return;
  }

  try {
    await api('/api/sessions/start', {
      method: 'POST',
      body: JSON.stringify({ subjectId })
    });
    document.getElementById('start-session-form').classList.add('hidden');
    document.getElementById('session-subject-select').value = '';
    await loadSessions();
    updateStats();
    showToast('Session started! 📖');
  } catch (err) {
    showToast(err.message, 'error');
  }
});

async function endSession(id) {
  try {
    await api(`/api/sessions/${id}/end`, { method: 'PUT' });
    await loadSessions();
    updateStats();
    showToast('Session ended! Good work! 💪');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ===== STATS =====
function updateStats() {
  document.getElementById('stat-subjects').textContent = subjects.length;
  document.getElementById('stat-tasks').textContent = tasks.length;
  document.getElementById('stat-sessions').textContent = sessions.length;
  document.getElementById('stat-completed').textContent = tasks.filter(t => t.status === 'completed').length;
}

// ===== INIT =====
if (token) {
  showDashboard();
} else {
  authScreen.classList.add('active');
}
