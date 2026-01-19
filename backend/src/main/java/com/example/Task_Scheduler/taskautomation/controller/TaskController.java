package com.example.Task_Scheduler.taskautomation.controller;

import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.io.InputStream;

import com.example.Task_Scheduler.taskautomation.model.Task;
import com.example.Task_Scheduler.taskautomation.model.TaskRun;
import com.example.Task_Scheduler.taskautomation.service.TaskService;
import com.example.Task_Scheduler.taskautomation.service.ReminderScheduler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.ExecutionException;

import org.apache.poi.ss.usermodel.*;

@RestController
@RequestMapping("/api/automation")
@CrossOrigin(origins = "*")
public class TaskController {
    // Only keep one TaskService field (already present above)

    @Autowired
    private ReminderScheduler reminderScheduler;

    // Manual email
    @PostMapping("/email/manual")
    public String sendManualEmail(@RequestBody EmailRequest request) throws ExecutionException, InterruptedException {
            System.out.println("Received manual email request: " + request);
            org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(TaskController.class);
        Task task = new Task();
        task.setId(java.util.UUID.randomUUID().toString());
        task.setAutomationType("EMAIL");
        task.setTemplateType(request.getTemplate());
        task.setUserEmail(request.getEmail());
        task.setRecipients(java.util.Collections.singletonList(request.getEmail()));
        task.setPayload(Map.of("body", request.getBody()));
        String nextRun = computeNextRun(request.getScheduledAt());
        task.setNextRunDate(nextRun);
        taskService.createTask(task);
        reminderScheduler.scheduleTask(task);
        logger.info("Task created with ID: {} and recipients: {}", task.getId(), task.getRecipients());
        logger.info("Task scheduled for: {}", task.getNextRunDate());
        System.out.println("Task created with ID: " + task.getId() + " and recipients: " + task.getRecipients());
        System.out.println("Task scheduled for: " + task.getNextRunDate());
        return "Manual email request stored and scheduled for " + request.getEmail();
    }

    // Excel email
    @PostMapping("/email/excel")
    public String sendExcelEmail(@RequestParam("type") String type,
                                 @RequestParam("template") String template,
                                 @RequestParam("body") String body,
                                 @RequestParam(value = "scheduledAt", required = false) String scheduledAt,
                                 @RequestParam("file") MultipartFile file)
            throws ExecutionException, InterruptedException {
        try {
            List<String> recipients = new ArrayList<>();
            try (InputStream is = file.getInputStream(); Workbook workbook = WorkbookFactory.create(is)) {
                Sheet sheet = workbook.getSheetAt(0);
                for (Row row : sheet) {
                    if (row == null) {
                        continue;
                    }
                    for (Cell cell : row) {
                        if (cell == null) {
                            continue;
                        }
                        cell.setCellType(CellType.STRING);
                        String value = cell.getStringCellValue();
                        if (value == null) {
                            continue;
                        }
                        String trimmed = value.trim();
                        if (trimmed.isEmpty()) {
                            continue;
                        }
                        // Treat any cell containing '@' as an email, so this works
                        // whether there is a header row or not and regardless of column.
                        if (trimmed.contains("@")) {
                            recipients.add(trimmed);
                            break; // only take first email per row
                        }
                    }
                }
            }

            if (recipients.isEmpty()) {
                return "No email addresses found in the uploaded Excel file";
            }

            Task task = new Task();
            task.setId(java.util.UUID.randomUUID().toString());
            task.setAutomationType("EMAIL");
            task.setTemplateType(template);
            task.setRecipients(recipients);
            task.setPayload(Map.of("body", body, "fileName", file.getOriginalFilename()));
            String nextRun = computeNextRun(scheduledAt);
            task.setNextRunDate(nextRun);
            taskService.createTask(task);
            reminderScheduler.scheduleTask(task);
            return "Bulk email request stored and scheduled for " + recipients.size() + " recipients";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to process Excel file for bulk email";
        }
    }


    // Reminder
    @PostMapping("/reminder")
    public String sendReminder(@RequestBody ReminderRequest request) throws ExecutionException, InterruptedException {
        Task task = new Task();
        task.setId(java.util.UUID.randomUUID().toString());
        task.setAutomationType("REMINDER");
        task.setTemplateType(request.getTemplate());
        task.setPayload(Map.of("message", request.getBody()));
        task.setNextRunDate(java.time.Instant.now().toString());
        taskService.createTask(task);
        reminderScheduler.scheduleTask(task);
        return "Reminder request stored and scheduled: " + request.getBody();
    }
// --- DTOs for requests ---
static class EmailRequest {
    private String type;
    private String template;
    private String body;
    private String email;
    private String scheduledAt;
    // getters and setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTemplate() { return template; }
    public void setTemplate(String template) { this.template = template; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(String scheduledAt) { this.scheduledAt = scheduledAt; }
}


static class ReminderRequest {
    private String type;
    private String template;
    private String body;
    // getters and setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTemplate() { return template; }
    public void setTemplate(String template) { this.template = template; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
}

    // Helper to compute next run time from optional scheduledAt
    private String computeNextRun(String scheduledAt) {
        try {
            if (scheduledAt != null && !scheduledAt.isBlank()) {
                java.time.LocalDateTime ldt = java.time.LocalDateTime.parse(scheduledAt);
                java.time.Instant instant = ldt.atZone(java.time.ZoneId.systemDefault()).toInstant();
                return instant.toString();
            }
        } catch (Exception e) {
            // Fallback to now if parsing fails
        }
        return java.time.Instant.now().toString();
    }

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getAllTasks() throws ExecutionException, InterruptedException {
        return taskService.getAllTasks();
    }

    @GetMapping("/emails")
    public List<Task> getAllEmailTasks() throws ExecutionException, InterruptedException {
        List<Task> allTasks = taskService.getAllTasks();
        List<Task> emailTasks = new ArrayList<>();
        for (Task task : allTasks) {
            if ("EMAIL".equals(task.getAutomationType())) {
                emailTasks.add(task);
            }
        }
        return emailTasks;
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable String id) throws ExecutionException, InterruptedException {
        return taskService.getTaskById(id);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) throws ExecutionException, InterruptedException {
        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable String id, @RequestBody Task updatedTask) throws ExecutionException, InterruptedException {
        return taskService.updateTask(id, updatedTask);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable String id) throws ExecutionException, InterruptedException {
        taskService.deleteTask(id);
    }

    @GetMapping("/{id}/runs")
    public List<TaskRun> getTaskRuns(@PathVariable String id) throws ExecutionException, InterruptedException {
        return taskService.getTaskRuns(id);
    }

    @PostMapping("/{id}/complete")
    public TaskRun completeTask(@PathVariable String id) throws ExecutionException, InterruptedException {
        TaskRun run = new TaskRun();
        run.setId(java.util.UUID.randomUUID().toString());
        run.setTaskId(id);
        run.setRunAt(java.time.LocalDateTime.now().toString());
        run.setStatus("success");
        return taskService.logTaskRun(run);
    }
}
