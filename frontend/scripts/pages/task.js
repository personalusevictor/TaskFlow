import { api, requireAuth } from "../core/api.js"
import { getUser } from "../core/session.js"

document.addEventListener("DOMContentLoaded", () => {
  requireAuth()
})

