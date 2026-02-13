package model;

import java.time.LocalDate;

public class Tarea {
	
	//Atributos Estaticos
	private static int contadorTareas = 0;
	
	//Atributos del Objeto
	private final int id;
	private String title;
	private String description;
	private LocalDate dateCreation;
	private LocalDate dateDeadline;
	private State state;
	private Priority priority;
	
	public Tarea(String title, String description, LocalDate dateCreation, LocalDate dateDeadline, Priority priority) {
		this.id = ++contadorTareas;
		setTitle(title);
		setDescription(description);
		setDateCreation(dateCreation);
		setDateDeadline(dateDeadline);
		setPriority(priority);
	}
	
	public Tarea(String title, LocalDate dateCreation, LocalDate dateDeadline, Priority priority) {
		this(title, null, dateCreation, dateDeadline, priority);
	}

	public int getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getDateCreation() {
		return dateCreation;
	}

	public void setDateCreation(LocalDate dateCreation) {
		this.dateCreation = dateCreation;
	}

	public LocalDate getDateDeadline() {
		return dateDeadline;
	}

	public void setDateDeadline(LocalDate dateDeadline) {
		this.dateDeadline = dateDeadline;
	}

	public State getState() {
		return state;
	}

	public Priority getPriority() {
		return priority;
	}

	public void setPriority(Priority priority) {
		this.priority = priority;
	}
	
	
	
}
