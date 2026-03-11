// scripts/services/api.js

const KEY_SESSION = "treeco_user"
const TASKS_KEY = "treeco_tasks"

// --- Sesión / usuario ---
export function getUser() {
  const raw = localStorage.getItem(KEY_SESSION)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(KEY_SESSION)
    return null
  }
}

export function requireAuth() {
  if (!getUser()) location.replace("index.html")
}

export function logout() {
  localStorage.removeItem(KEY_SESSION)
  location.replace("index.html")
}

// --- Tareas ---
export function getTasks(userId) {
  const raw = localStorage.getItem(TASKS_KEY)
  if (!raw) return []
  try {
    const allTasks = JSON.parse(raw)
    // Filtramos solo las del usuario
    return allTasks.filter((t) => t.userId === userId)
  } catch {
    return []
  }
}

export function addTask(userId, title) {
  const raw = localStorage.getItem(TASKS_KEY)
  const allTasks = raw ? JSON.parse(raw) : []
  const newTask = { id: Date.now(), userId, title, done: false }
  allTasks.push(newTask)
  localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks))
  return newTask
}
