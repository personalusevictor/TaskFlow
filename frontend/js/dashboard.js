// dashboard.js - COMPLETO
const CLAVE_SESION = "usuario_treeco"

// 1. COMPROBACIÓN DE SEGURIDAD
const sesionRaw = localStorage.getItem(CLAVE_SESION)

if (!sesionRaw == null) {
  window.location.replace("../index.html")
} else {
  const usuario = JSON.parse(sesionRaw)

  // 2. MOSTRAR NOMBRE
  const display = document.getElementById("username")
  if (display && usuario.username) {
    display.textContent = usuario.username
  }

  // 3. LOGOUT
  const btnLogout = document.getElementById("logout")
  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault()
      localStorage.removeItem(CLAVE_SESION)
      window.location.replace("../index.html")
    })
  }

  // 4. NAVEGACIÓN ACTIVA
  const enlaces = document.querySelectorAll(".navegador a")
  enlaces.forEach((link) => {
    link.addEventListener("click", function () {
      enlaces.forEach((l) => l.classList.remove("enlace-activo"))
      this.classList.add("enlace-activo")
    })
  })
}
