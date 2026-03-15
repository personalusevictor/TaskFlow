import { api, requireAuth } from "../core/api.js"
import { getUser } from "../core/session.js"

document.addEventListener("DOMContentLoaded", () => {
  requireAuth()
  loadTasks()
})

// ------------- LOAD TASKS ---------------

async function loadTasks() {
  const tasksListElement = document.getElementById("listTasks")

  try {
    const currentSessionUser = getUser()
    const userId = currentSessionUser?.userId
    const [tasks] = await Promise.all([api.users.getTasks(userId), api.projects.getByUser(userId)])
    const pendingTasks = tasks.filter((task) => task.completed === false).sort(sortTasksByDeadline)

    if (pendingTasks.length === 0) {
      tasksListElement.innerHTML = `
        <div class="noTask">
          <div class="noTaskIcon">✓</div>
    
          <p class="noTaskSubtitle">Todo completado</p>
    
          <h2 class="noTaskTitle">No tienes tareas pendientes</h2>
    
          <p class="noTaskText">
            Todo está al día. Crea una nueva tarea para empezar a organizar tu trabajo
            y verla aquí ordenada por fecha de finalización.
          </p>
    
          <div class="noTaskGoTasks">
            <a href="./../../task.html" class="noTaskGoTask">
              Ir a tareas
            </a>
            <a href="./../../task.html" class="noTaskCreateTask">
              Crear nueva tarea
            </a>
          </div>
        </div>
      `
      return
    }

    pendingTasks.forEach((task) => {
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
      const remaining = getRemainingTime(task)

      if (remaining < 0 && Math.abs(remaining) > THIRTY_DAYS) return

      const taskDivElement = createTask(task)
      tasksListElement.appendChild(taskDivElement)
    })
  } catch (error) {
    console.error("Error cargando tareas:", error)

    if (tasksListElement) {
      tasksListElement.innerHTML = `<p>Error al cargar las tareas: ${error.message}</p>`
    }
  }
}

// Añade al html las tareas

function createTask(task) {
  const taskDivElement = document.createElement("div")
  taskDivElement.classList.add("task")

  const priorityClass = getPriorityClass(task.priority)
  const deadlineText = formatDate(task.dateDeadline)
  const stateText = formatState(task.state)
  const remainingTime = formatRemainingTime(getRemainingTime(task))

  taskDivElement.innerHTML = `
    <div class="taskHeader">
      <h3 class="taskTitle">${task.title ?? "Sin título"}</h3>
      <span class="taskPriority ${priorityClass}">
        ${task.priority ?? "SIN PRIORIDAD"}
      </span>
    </div>

    <p class="taskProjectTitle">${task.projectName ?? "Sin proyecto"}</p>

    <p class="taskDescription">
      ${task.description ?? "Sin descripción"}
    </p>

    <div class="taskFooter">
      <span class="taskState">${stateText}</span>
      <span class="taskRemainingTime ${priorityClass}">${remainingTime}</span>
      <span class="taskDeadline">${deadlineText}</span>
    </div>
  `

  return taskDivElement
}

// Ordeanar por fecha de entrega

function sortTasksByDeadline(task1, task2) {
  const task1DeadlineTime = task1?.dateDeadline ? new Date(task1.dateDeadline).getTime() : Number.MAX_SAFE_INTEGER
  const task2DeadlineTime = task2?.dateDeadline ? new Date(task2.dateDeadline).getTime() : Number.MAX_SAFE_INTEGER

  return task1DeadlineTime - task2DeadlineTime
}

// Obtener tiempo restante

function getRemainingTime(task) {
  const taskDeadlineTime = task?.dateDeadline ? new Date(task.dateDeadline).getTime() : Number.MAX_SAFE_INTEGER

  return taskDeadlineTime - Date.now()
}

// Obtener clases dependiendo de x situacion

function getPriorityClass(priority) {
  const priorityValue = String(priority ?? "").toLowerCase()

  if (priorityValue === "high") return "red"
  if (priorityValue === "mid") return "orange"
  if (priorityValue === "low") return "green"

  return "priority-default"
}

// Formatear datos

function formatState(state) {
  if (!state) return "Sin estado"

  return state
    .toLowerCase()
    .split("_")
    .map((statePart) => statePart.charAt(0).toUpperCase() + statePart.slice(1))
    .join(" ")
}

function formatDate(dateString) {
  if (!dateString) {
    return "Sin fecha límite"
  }

  const deadlineDate = new Date(dateString)

  return deadlineDate
    .toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(",", "")
}

function formatRemainingTime(ms) {
  if (ms >= Number.MAX_SAFE_INTEGER) return "Sin fecha limite"

  const abs = Math.abs(ms)

  const days = Math.floor(abs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((abs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60))

  if (days >= 1) {
    const text = hours > 0 ? `${days}d ${hours}h` : `${days}d`
    return ms > 0 ? `Tiempo restante: ${text}` : `Vencida hace ${text}`
  }

  if (hours >= 1) {
    const text = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    return ms > 0 ? `Tiempo restante: ${text}` : `Vencida hace ${text}`
  }

  return ms > 0 ? `Tiempo restante: ${minutes}m` : `Vencida hace ${minutes}m`
}
