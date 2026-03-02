package com.treeco.api.model;

public enum TaskType {
    NORMAL,         // Tarea estándar
    CODE,           // Tarea de programación (tiene CodeTask asociado)
    REVIEW,         // Revisión de código
    MEETING,        // Reunión/evento
    DOCUMENTATION   // Documentación
}