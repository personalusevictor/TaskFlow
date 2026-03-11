import { getUser, requireAuth, getTasks } from "../api"

document.addEventListener("DOMContentLoaded", () => {
  requireAuth()

  const user = getUser()
  if (!user) return

  const container = document.getElementById("tasks-container")
  container.innerHTML = ""

  const tasks = getTasks(user.id)
  if (!tasks.length) {
    container.innerHTML = "<p>No tienes tareas</p>"
    return
  }

  tasks.forEach((task, index) => {
    const div = document.createElement("div")
    div.className = "task"
    div.id = "task" + (index + 1)
    div.textContent = task.title
    container.appendChild(div)
  })
})
