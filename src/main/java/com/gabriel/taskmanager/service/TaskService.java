package com.gabriel.taskmanager.service;

import com.gabriel.taskmanager.model.Task;
import com.gabriel.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public Task createTask(Task task) {
        DayOfWeek day = LocalDate.now().getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("Tasks only can be create at week days");
        }
        task.setCreatedAt(LocalDate.now());
        task.setStatus("PENDING");
        return repository.save(task);
    }

    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    public Optional<Task> getTaskById(Long id) {
        return repository.findById(id);
    }


    public Task updateTask(Long id, Task taskDetails) {
        Optional<Task> optionalTask = repository.findById(id);
        if (optionalTask.isEmpty()) {
            throw new IllegalArgumentException("Task not found");
        }

        Task existingTask = optionalTask.get();

        if (!"PENDING".equalsIgnoreCase(existingTask.getStatus())) {
            throw new IllegalStateException("Only tasks with status PENDING can be updated.");
        }

        existingTask.setStatus(taskDetails.getStatus() != null ? taskDetails.getStatus() : existingTask.getStatus());

        return repository.save(existingTask);
    }

    public void deleteTask(Long id) {
        Task task = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));

        if (!"PENDING".equals(task.getStatus())) {
            throw new IllegalStateException("Only is possible to delete tasks with PENDING status");
        }

        if (task.getCreatedAt() == null || task.getCreatedAt().isAfter(LocalDate.now().minusDays(5))) {
            throw new IllegalStateException("Only is possible to delete tasks with more than 5 days");
        }

        repository.deleteById(id);
    }

    public List<Task> searchByTitle(String title) {
        return repository.findByTitleContainingIgnoreCase(title);
    }
}
