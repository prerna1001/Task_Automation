# Frontend (React.js)

This React app provides the UI for creating and managing automated email tasks.

## Main Screens

- **Create Automation tab**
	- Choose an email template:
		- Daily reminder
		- Weekly promotional / summary
		- Monthly summary
		- 3‑day, 7‑day, 14‑day follow‑up emails
	- Enter either a single email address or upload an Excel file with multiple addresses.
	- Compose the email body.
	- Configure when it should run:
		- **Daily reminder:** only pick a **time of day**; it will run every day at that time.
		- **Weekly / Monthly / 3, 7, 14‑day follow‑up:** pick a **start date + time** for the first run.

- **Manage Emails tab**
	- View all existing automated email tasks in a table.
	- See template, recipients, body preview, and next scheduled run time.
	- Edit an automation inline (template, recipients, body, schedule).
	- Delete an automation when it is no longer needed.

The frontend communicates with the Spring Boot backend at `/api/automation` (default `http://localhost:8081/api/automation` in development).
