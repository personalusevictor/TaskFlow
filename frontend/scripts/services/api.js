const API_URL = "http://localhost:8080"

export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`)
  if (!res.ok) throw new Error("Error al obtener tareas")
  return res.json()
}

export async function createTask(taskData) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  })
  if (!res.ok) throw new Error("Error al crear tarea")
  return res.json()
}

export async function deleteTask(taskId) {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Error al eliminar tarea")
  return res.json()
}
