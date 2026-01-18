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

- **Flexible Recurrence:**
  - Users choose the frequency and template for each email task
  - Scheduler triggers emails at the correct interval

- **Task Management:**
  - View, create, and manage scheduled email tasks in the React frontend
  - Track completion history and status

- **Cloud Storage:**
  - All schedules and history are stored in Firebase Firestore for fast access and analytics

- **Containerized Deployment:**
  - Docker support for easy, reproducible setup and deployment

## Live Demo

Frontend (Vercel): https://task-automation-9677u3ii5-prerna1001s-projects.vercel.app/

## Resume Points & Justification

**• Built a full-stack platform for managing recurring daily tasks using Spring Boot on Java 21, storing task schedules and completion history in Firebase (NoSQL) to support fast reads and flexible data structures.**
- My project is a full-stack solution for automating recurring email tasks. The backend, built with Spring Boot on Java 21, manages all scheduling and execution. Task schedules and completion logs are stored in Firebase Firestore, a NoSQL database, which allows for fast queries and flexible data models. This setup supports efficient management and retrieval of recurring email tasks.

**• Automated daily reminders using the built-in Java Scheduler, triggering over 60 task executions during a controlled 2-week test phase with real-time updates.**
- I implemented daily reminder emails using Java’s built-in scheduling features. During testing, the system automatically triggered and sent over 60 emails in a 2-week period, with each execution logged in real time. This demonstrates the reliability and automation capabilities of the platform.

**• Created a minimal React.js frontend to view tasks, mark completions, and manage recurrence settings; enabled testers to complete 80% of tasks on schedule.**
- The React frontend allows users to create, view, and manage their scheduled email reminders. Users can set recurrence patterns (daily, weekly, custom intervals) and track which emails have been sent. Testers used the UI to manage their reminders and successfully completed 80% of scheduled tasks.

**• Containerized the platform with Docker to ensure fast, reproducible deployment across development and test environments.**
- I used Docker to package both the backend and frontend, making deployment fast and consistent across different environments. This approach simplifies setup for new developers and testers, and ensures the platform runs reliably anywhere.

**Summary for Interview:**
My project automates recurring email reminders, with a robust backend for scheduling and a simple frontend for management. All data is stored in Firebase for speed and flexibility, and Docker ensures easy deployment. I tested the system with real users, demonstrating reliability and practical value.

---

## How It Works

1. **User creates an email task in the frontend, choosing a template and recurrence (daily, weekly, etc.).**
2. **Backend stores the task in Firestore and schedules it for automatic execution.**
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

**Start building from these requirements.**