# Automated Email Reminder Platform

## Overview
This project is a full-stack platform for automating recurring email tasks. Users can schedule emails to be sent daily, weekly, monthly, or as custom follow-ups (e.g., after 3, 7, or 14 days). The backend is built with Spring Boot (Java 21) and stores task schedules and completion history in Firebase Firestore (NoSQL). The React frontend allows users to create, manage, and track their automated email reminders.

---

## Features

- **Automated Email Scheduling:**
  - Daily reminders (e.g., "Daily reminder" template)
  - Weekly promotional and summary emails
  - Monthly summary emails
  - Custom follow-up emails (3, 7, 14 days)

- **Flexible Recurrence & Scheduling UI:**
  - Users choose the frequency and template for each email task
  - For **Daily reminder**, users pick only a **time of day**; the system runs it every day at that time.
  - For **Weekly / Monthly / 3, 7, 14‑day follow‑up** templates, users pick a **start date + time**, which becomes the first run.
  - The backend stores this as `nextRunDate` and the scheduler triggers emails at the correct times.

- **Task Management UI (Manage Emails tab):**
  - Separate **Create Automation** and **Manage Emails** tabs in the React frontend
  - View all automated email tasks (template, recipients, body, next run time)
  - Edit existing automations inline (template, recipients, body, schedule)
  - Delete automations that are no longer needed

- **Cloud Storage:**
  - All schedules and history are stored in Firebase Firestore for fast access and analytics

- **Containerized Deployment:**
  - Docker support for easy, reproducible setup and deployment

## Live Demo

Frontend (Vercel): https://task-automation-git-main-prerna1001s-projects.vercel.app/

---

## How It Works

1. **User creates an email task in the frontend, choosing a template and schedule (time only for daily, or date + time for others).**
2. **Backend stores the task in Firestore and schedules it for automatic execution based on `nextRunDate`.**
3. **Java Scheduler triggers the email at the correct time, sending it to the specified recipient(s).**
4. **Completion history is logged for analytics and tracking.**

---

## Running the Project

1. Start the backend:
   ```sh
   cd backend
   ./gradlew bootRun
   ```
2. Start the frontend:
   ```sh
   cd frontend
   npm install
   npm start
   ```
3. Access the React UI to create and manage email reminders.

---

## Technologies Used

- Java 21, Spring Boot
- Firebase Firestore (NoSQL)
- React.js
- Docker

---

## Example Use Cases

- Daily self-reminder emails
- Weekly promotional or summary emails
- Custom follow-up emails for tasks or contacts

---

## Why This Project Is Valuable

- Demonstrates backend automation, cloud integration, and real-time scheduling
- Shows full-stack development skills (Java, React, Docker)
- Provides a practical solution for automated communications and reminders
- Interval tasks: run if nextRunDate == today

#### After Running
- Update lastRunAt
- Compute new nextRunDate
- Log to TaskRun collection

### Firebase Integration
- Use Firestore SDK
- Implement helper class for reading/writing tasks

### Email + Notification Senders
- Implement a simple EmailService (SMTP or stub)
- Implement NotificationService (push or dummy)

---

## Development Instructions

- Generate maintainable Java classes, DTOs, models, and services for this entire system.
- Only allow users to select and configure predefined automations.
- No support for custom scripts or arbitrary code execution.

---
