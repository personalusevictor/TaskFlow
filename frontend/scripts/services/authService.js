const KEY_SESSION = "treeco_user"

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
  if (!getUser()) {
    location.replace("index.html")
  }
}

export function logout() {
  localStorage.removeItem(KEY_SESSION)
  location.replace("index.html")
}
