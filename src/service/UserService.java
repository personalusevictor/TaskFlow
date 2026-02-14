package service;

import java.util.ArrayList;
import java.util.List;
import model.User;

public class UserService {
    /**
     * Atributos
     */
    private List<User> users;

    /**
     * Constructor que inicializa la lista de usuarios.
     */
    public UserService() {
        this.users = new ArrayList<>();
    }

    /**
     * Registra un nuevo usuario en el sistema.
     * 
     * @param username Nombre del usuario.
     * @param email    Correo electrónico (debe ser único).
     * @param password Contraseña del usuario.
     * @return El objeto User creado.
     * @throws IllegalAccessError Si el email ya existe en el sistema.
     */
    public User registerUser(String username, String email, String password) {
        if (existsEmail(email)) {
            throw new IllegalAccessError("Ese email ya esta registrado");
        }

        User user = new User(username, email, password);
        this.users.add(user);
        return user;
    }

    /**
     * Valida las credenciales de un usuario para el inicio de sesión.
     * 
     * @param email    Email introducido.
     * @param password Contraseña introducida.
     * @return El objeto User si las credenciales son correctas, null en caso
     *         contrario.
     */
    public User authenticate(String email, String password) {
        User user = searchByEmail(email);

        if (user == null) {
            return null;
        } else if (!user.checkPassword(password)) {
            return null;
        } else {
            return user;
        }
    }

    /**
     * Busca un usuario por su correo electrónico (ignora mayúsculas/minúsculas).
     * 
     * @param email Email a buscar.
     * @return El usuario encontrado o null si no existe.
     */
    public User searchByEmail(String email) {
        return users.stream().filter(t -> t.getEmail().equalsIgnoreCase(email)).findFirst().orElse(null);
    }

    /**
     * Comprueba si un email ya está en uso.
     * 
     * @param email Email a verificar.
     * @return true si existe, false si está disponible.
     */
    public boolean existsEmail(String email) {
        if (searchByEmail(email) == null) {
            return false;
        }

        return true;
    }

    /**
     * Devuelve una copia de la lista de usuarios.
     * Se usa List.copyOf para proteger la lista original de modificaciones externas
     * (encapsulamiento).
     */
    public List<User> getUsers() {
        return List.copyOf(users);
    }

    /**
     * Actualiza la contraseña de un usuario existente.
     * 
     * @param user        El usuario a modificar.
     * @param newPassword La nueva contraseña.
     */
    public void changePassword(User user, String newPassword) {
        if (user == null || newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Los campos 'user' o 'newPassword' no pueden ser null");
        }
        user.setPassword(newPassword);
    }

    /**
     * Elimina un usuario del sistema.
     * 
     * @param user El usuario a dar de baja.
     */
    public void removeUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("El campo 'user' no puede ser null");
        }

        users.remove(user);
    }

}
