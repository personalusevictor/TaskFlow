package service;

import java.util.List;

import model.Project;
import model.Task;

public class ProjectService {
    private static List<Project> projects;

    private ProjectService() {
    }

    public static Project createProject(String name, String description) {
        Project project = new Project(name, description);
        projects.add(project);
        return project;
    }

    public static Project searchById(int id) {
        return projects.stream().filter(t -> t.getId() == id).findFirst().orElse(null);
    }

    public static boolean removeProject(int id) {
        return projects.remove(ProjectService.searchById(id));
    }

    public static List<Project> getProjects() {
        return List.copyOf(projects);
    }

    public static void addTaskToProject(int projectId, Task task) {
        ProjectService.searchById(projectId).addTask(task);
    }

    public static void removeTaskToProject(int projectId, Task task) {
        ProjectService.searchById(projectId).removeTask(task);
    }

    public static List<Task> getTaskOfProject(int projectId) {
        return ProjectService.searchById(projectId).getTasks();
    }

    public static int getProgressProject(int projectId) {
        return ProjectService.searchById(projectId).getProgress();
    }
}
