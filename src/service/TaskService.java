package service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import model.Priority;
import model.State;
import model.Task;

public class TaskService {
    private TaskService() {
    }

    private static List<Task> tasks;

    public static Task createTask(String title, String description, Priority priority, LocalDate dateDeadline) {
        Task task = Task.builder(title).description(description).priority(priority).deadline(dateDeadline).build();
        tasks.add(task);
        return task;
    }

    public static Task searchById(int id) {
        return tasks.stream().filter(t -> t.getId() == id).findFirst().orElse(null);
    }

    public static boolean removeTask(int id) {
        return tasks.remove(TaskService.searchById(id));
    }

    public static void changeState(int id, boolean completed) {
        TaskService.searchById(id).setCompleted(completed);
    }

    public static List<Task> filterByState(State state) {
        return tasks.stream().filter(t -> t.getState() == state).toList();
    }

    public static List<Task> filterByPriority(Priority priority) {
        return tasks.stream().filter(t -> t.getPriority() == priority).toList();
    }

    public static List<Task> getTasks() {
        return List.copyOf(tasks);
    }

    public static List<Task> orderByDate() {
        Comparator<Task> comparatorDate = (o1, o2) -> o1.getDateDeadline().compareTo(o2.getDateDeadline());
        return tasks.stream().sorted(comparatorDate).toList();
    }
}
