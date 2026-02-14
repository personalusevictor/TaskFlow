package service;

import java.util.ArrayList;
import java.util.List;
import org.mindrot.jbcrypt.BCrypt;
import model.User;

public class UserService {
    private List<User> users;

    public UserService() {
        this.users = new ArrayList<>();
    }

    public User registerUser(String username, String email, String password) {
        if (existsEmail(email)) {
            throw new IllegalAccessError("Ese email ya esta registrado");
        }

        User user = new User(username, email, password);
        this.users.add(user);
        return user;
    }

    public User authenticate(String email, String password) {
        User user = searchByEmail(email);

        if (user == null) {
            return null;
        } else if (!BCrypt.checkpw(password, user.getHashPassword())) {
            return null;
        } else {
            return user;
        }
    }

    public User searchByEmail(String email) {
        return users.stream().filter(t -> t.getEmail().equalsIgnoreCase(email)).findFirst().orElse(null);
    }

    public boolean existsEmail(String email) {
        if (searchByEmail(email) == null) {
            return false;
        }

        return true;
    }

    public List<User> getUsers() {
        return List.copyOf(users);
    }

    public void changePassword(User user, String newPassword) {
        if (user == null || newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Los campos 'user' o 'newPassword' no pueden ser null");
        }
        user.setPassword(newPassword);
    }

    public void removeUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("El campo 'user' no puede ser null");
        }

        users.remove(user);
    }

}
