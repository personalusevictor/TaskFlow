const CLAVE_SESION = "treeco_user"

const sesionRaw = localStorage.getItem(CLAVE_SESION)

if (!sesionRaw) {
  globalThis.location.replace("index.html")
}

let usuario

try {
  usuario = JSON.parse(sesionRaw)
} catch {
  localStorage.removeItem(CLAVE_SESION)
  globalThis.location.replace("index.html")
}

const display = document.getElementById("username")
if (display && usuario?.username) {
  display.textContent = usuario.username
}

const btnLogout = document.getElementById("logout")
if (btnLogout) {
  btnLogout.addEventListener("click", (e) => {
    e.preventDefault()
    localStorage.removeItem(CLAVE_SESION)
    globalThis.location.replace("index.html")
  })
}
