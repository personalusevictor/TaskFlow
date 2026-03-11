;(function initHeader() {
  const KEY_SESSION = "treeco_user"
  const sesionRaw = localStorage.getItem(KEY_SESSION)

  if (!sesionRaw) {
    location.replace("index.html")
    return
  }

  let usuario
  try {
    usuario = JSON.parse(sesionRaw)
  } catch {
    localStorage.removeItem(KEY_SESSION)
    location.replace("index.html")
    return
  }

  const display = document.getElementById("username")
  if (display && usuario?.username) {
    display.textContent = usuario.username
  }

  const btnLogout = document.getElementById("logout")
  if (btnLogout) {
    btnLogout.addEventListener("click", (e) => {
      e.preventDefault()
      localStorage.removeItem(KEY_SESSION)
      location.replace("index.html")
    })
  }
  const currentPath = globalThis.location.pathname
  const navLinks = document.querySelectorAll("nav.navegator a")
  navLinks.forEach((link) => {
    link.classList.remove("link-active")
    if (link.getAttribute("href").endsWith(currentPath.split("/").pop())) {
      link.classList.add("link-active")
    }
  })
})()
