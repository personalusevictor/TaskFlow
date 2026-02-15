package model;

import java.util.ArrayList;
import java.util.List;
import org.mindrot.jbcrypt.BCrypt;

/**
 * Clase que representa un usuario del sistema TaskFlow
 */
public class User {
    // Atributos estaticos
    private static int userCount = 0;

    // Atributos no estaticos
    private final int ID;
    private String username;
    private String email;
    private String hashPassword;
    private List<Project> projects;

    /* CONSTRUCTOR */

    public User(String username, String email, String password) {
        this.ID = ++userCount;
        setUsername(username);
        setEmail(email);
        setPassword(password);
        this.projects = new ArrayList<>();
    }

    /* GETTERS Y SETTERS */

    public int getId() {
        return ID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("El campo 'username' no puede ser nulo o vacío");
        }
        this.username = username.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("El campo 'email' no puede ser nulo o vacío");
        } else if (!email.matches("^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$")) {
            throw new IllegalArgumentException("Formato de 'email' mal introducido");
        }
        this.email = email.trim();
    }

    public String getHashPassword() {
        return hashPassword;
    }

    public void setPassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("El campo 'password' no puede ser nulo o vacío");
        } else if (password.length() < 8) {
            throw new IllegalArgumentException("Mínimo 8 caracteres");
        }

        this.hashPassword = BCrypt.hashpw(password, BCrypt.gensalt(6));
    }

    /**
     * Obtiene una copia inmutable de la lista de proyectos
     * 
     * @return Lista de proyectos del usuario
     */
    public List<Project> getProjects() {
        return List.copyOf(this.projects);
    }

    /* MÉTODOS DE LÓGICA */

    /**
     * Verifica si la contraseña proporcionada coincide con el hash almacenado
     * 
     * @param password Contraseña a verificar
     * @return true si la contraseña es correcta, false en caso contrario
     */
    public boolean checkPassword(String password) {
        if (password == null) {
            return false;
        }
        return BCrypt.checkpw(password, this.hashPassword);
    }

    /**
     * Añade un proyecto a la lista de proyectos del usuario
     * 
     * @param project Proyecto a añadir
     * @return true si se añadió correctamente
     */
    public boolean addProject(Project project) {
        if (project == null) {
            throw new IllegalArgumentException("El proyecto no puede ser nulo");
        }
        return this.projects.add(project);
    }

    /**
     * Elimina un proyecto de la lista
     * 
     * @param project Proyecto a eliminar
     * @return true si se eliminó correctamente
     */
    public boolean removeProject(Project project) {
        return this.projects.remove(project);
    }

    /**
     * Elimina un proyecto por su índice
     * 
     * @param index Índice del proyecto
     * @return El proyecto eliminado
     */
    public Project removeProject(int index) {
        return this.projects.remove(index);
    }

    /**
     * Obtiene un proyecto por su ID
     * 
     * @param projectId ID del proyecto
     * @return El proyecto encontrado o null si no existe
     */
    public Project getProjectById(int projectId) {
        return this.projects.stream()
                .filter(p -> p.getID() == projectId)
                .findFirst()
                .orElse(null);
    }

    /* MÉTODOS AUXILIARES */
    @Override
    public String toString() {
        return String.format("ID: %d | Username: %s | Email: %s | Projects: %d",
                this.ID, this.username, this.email, this.projects.size());
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ID;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        User other = (User) obj;
        if (ID != other.ID)
            return false;
        return true;
    }
}