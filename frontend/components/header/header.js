;(function initHeader() {
  const CLAVE_SESION = "treeco_user"
  const sesionRaw = localStorage.getItem(CLAVE_SESION)

  if (!sesionRaw) {
    location.replace("index.html")
    return
  }

  let usuario
  try {
    usuario = JSON.parse(sesionRaw)
  } catch {
    localStorage.removeItem(CLAVE_SESION)
    location.replace("index.html")
    return
  }

  // Mostrar nombre de usuario
  const display = document.getElementById("username")
  if (display && usuario?.username) {
    display.textContent = usuario.username
  }

  // Logout
  const btnLogout = document.getElementById("logout")
  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault()
      localStorage.removeItem(CLAVE_SESION)
      location.replace("index.html")
    })
  }

  // Establecer link activo
  const currentPath = globalThis.location.pathname
  const navLinks = document.querySelectorAll("nav.navegator a")
  navLinks.forEach((link) => {
    link.classList.remove("link-active")
    if (link.getAttribute("href").endsWith(currentPath.split("/").pop())) {
      link.classList.add("link-active")
    }
  })
})()
