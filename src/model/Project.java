package model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Project {
    // Atributos estaticos
    private static int proyectCount = 0;

    public static int getProyectCount() {
        return proyectCount;
    }

    // Atributos no-estaticos
    private final int ID;
    private String name;
    private String description;
    private LocalDate creationDate;
    private List<Tarea> tasks;

    public Project(String name, String description) {
        this.ID = ++proyectCount;
        this.name = name;
        this.description = description;
        this.creationDate = LocalDate.now();
        this.tasks = new ArrayList<>();

    }

    public Project(String name) {
        this(name, null);
    }

    public boolean addTask(Tarea task) {
        return this.tasks.add(task);
    }

    public void addTask(Tarea task, int index) {
        this.tasks.add(index, task);
    }

    public boolean removeTask(Tarea task) {
        return this.tasks.remove(task);
    }

    public Tarea removeTask(int index) {
        return this.tasks.remove(index);
    }

    public List<Tarea> getTasksByState(State state) {
        if (state == null) {
            throw new IllegalArgumentException("El campo 'state' no puede estar vacio");
        }

        return this.tasks.stream().filter(t -> t.getState() == state).toList();
    }

    public List<Tarea> getInProgressTasks() {
        return getTasksByState(State.IN_PROGRESS);
    }

    public List<Tarea> getCompletedTasks() {
        return getTasksByState(State.COMPLETED);
    }

    public List<Tarea> getExpiredTasks() {
        return getTasksByState(State.EXPIRED);
    }

    public double getProgress() {
        if (this.tasks.isEmpty()) {
            return 0;
        }

        return (double) (getCompletedTasks().size() * 100) / this.tasks.size();
    }

    public int getID() {
        return ID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("El campo 'name' no puede ser nulo o vacío");
        }
        this.name = name.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = (description == null) ? null : description.trim();
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public List<Tarea> getTasks() {
        return List.copyOf(this.tasks);
    }

    @Override
    public String toString() {
        if (description == null) {
            return String.format("ID: %d%n Name: %s%n Tasks: ",
                    this.ID, this.name);
        } else {
            return String.format("ID: %d%n Name: %s%n Description: %s%n Tasks: ",
                    this.ID, this.name, this.description);
        }
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ID;
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        result = prime * result + ((description == null) ? 0 : description.hashCode());
        result = prime * result + ((creationDate == null) ? 0 : creationDate.hashCode());
        result = prime * result + ((tasks == null) ? 0 : tasks.hashCode());
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
        Project other = (Project) obj;
        if (ID != other.ID)
            return false;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;
        if (description == null) {
            if (other.description != null)
                return false;
        } else if (!description.equals(other.description))
            return false;
        if (creationDate == null) {
            if (other.creationDate != null)
                return false;
        } else if (!creationDate.equals(other.creationDate))
            return false;
        if (tasks == null) {
            if (other.tasks != null)
                return false;
        } else if (!tasks.equals(other.tasks))
            return false;
        return true;
    }

}