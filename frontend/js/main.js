const API_URL = "http://localhost:8080/api/user"

async function fetchUsers() {
  const grid = document.getElementById("user-grid")
  grid.innerHTML = "<p>Cargando datos de Supabase...</p>"

  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error("Error en la API")

    const users = await response.json()

    grid.innerHTML =
      users
        .map(
          (user) => `
            <div class="user-card">
                <h3>${user.username}</h3>
                <p>ID: ${user.id}</p>
                <p>Email: ${user.email}</p>
            </div>
        `,
        )
        .join("") || "<p>No hay usuarios en la base de datos.</p>"
  } catch (error) {
    grid.innerHTML = `<p style="color:red">Error: ${error.message}. ¿Está el backend encendido?</p>`
  }
}

fetchUsers()
