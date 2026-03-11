function loadComponent(id, path) {
  return fetch(path)
    .then((res) => res.text())
    .then((html) => {
      // Insertar HTML
      const container = document.getElementById(id)
      container.innerHTML = html

      // Cargar CSS automáticamente
      const cssLink = document.createElement("link")
      cssLink.rel = "stylesheet"
      cssLink.href = path.replace(".html", ".css")
      document.head.appendChild(cssLink)

      // Cargar JS automáticamente
      const script = document.createElement("script")
      script.src = path.replace(".html", ".js")
      script.defer = true

      // Si quieres ejecutar algo al cargar, usa onload
      script.onload = () => {
        console.log(`Componente ${id} cargado y JS ejecutado`)
      }

      document.body.appendChild(script)
    })
    .catch((err) => console.error(`Error cargando componente ${id}:`, err))
}
