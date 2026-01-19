import React, { useState } from "react";
import "./index.css";

const EMAIL_TEMPLATES = [
  "Daily reminder",
  "Weekly promotional email",
  "Weekly summary email",
  "Monthly summary email",
  "3-day follow-up email",
  "7-day follow-up email",
  "14-day follow-up email",
];

function App() {
  const [activeTab, setActiveTab] = useState("create"); // "create" or "manage"
  const [selectedType, setSelectedType] = useState("");
  const [inputMode, setInputMode] = useState("");
  const [singleEmail, setSingleEmail] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [emailTemplate, setEmailTemplate] = useState(EMAIL_TEMPLATES[0]);
  const [body, setBody] = useState("");
  const [emailTasks, setEmailTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(""); // for weekly/monthly/follow-ups
  const [scheduleTime, setScheduleTime] = useState(""); // time of day

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8081/api/automation";

  // Helpers to understand template type
  const isDailyTemplate = emailTemplate === "Daily reminder";
  const isWeeklyTemplate =
    emailTemplate === "Weekly promotional email" ||
    emailTemplate === "Weekly summary email";
  const isMonthlyTemplate = emailTemplate === "Monthly summary email";
  const isFollowUpTemplate =
    emailTemplate === "3-day follow-up email" ||
    emailTemplate === "7-day follow-up email" ||
    emailTemplate === "14-day follow-up email";

  // Build scheduledAt string (yyyy-MM-dd'T'HH:mm) depending on template
  const buildScheduledAt = () => {
    if (!scheduleTime) return null;

    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

    if (isDailyTemplate) {
      const now = new Date();
      const [h, m] = scheduleTime.split(":");
      const scheduled = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        Number(h),
        Number(m),
        0,
        0
      );
      if (scheduled.getTime() <= now.getTime()) {
        scheduled.setDate(scheduled.getDate() + 1);
      }
      const yyyy = scheduled.getFullYear();
      const MM = pad(scheduled.getMonth() + 1);
      const dd = pad(scheduled.getDate());
      const HH = pad(scheduled.getHours());
      const mm = pad(scheduled.getMinutes());
      return `${yyyy}-${MM}-${dd}T${HH}:${mm}`;
    }

    // Weekly, monthly, follow-ups: user provides a start date + time
    if (!scheduleDate) return null;
    return `${scheduleDate}T${scheduleTime}`;
  };

  // Fetch all email tasks
  const fetchEmailTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/emails`);
      const data = await response.json();
      setEmailTasks(data);
    } catch (error) {
      console.error("Error fetching email tasks:", error);
    }
  };

  // Delete email task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this automated email?")) {
      return;
    }
    try {
      await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "DELETE",
      });
      alert("Email automation deleted successfully!");
      fetchEmailTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete email automation");
    }
  };

  // Update email task
  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      alert("Email automation updated successfully!");
      setEditingTask(null);
      fetchEmailTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update email automation");
    }
  };

  // Load email tasks when switching to manage tab
  React.useEffect(() => {
    if (activeTab === "manage") {
      fetchEmailTasks();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-bold mb-6">Email Automation</h1>
      
      {/* Tab Navigation */}
      <div className="mb-6 flex gap-2">
        <button
          className={`px-6 py-3 rounded-lg font-semibold ${
            activeTab === "create"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-600"
          }`}
          onClick={() => setActiveTab("create")}
        >
          Create Automation
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-semibold ${
            activeTab === "manage"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 border border-blue-600"
          }`}
          onClick={() => setActiveTab("manage")}
        >
          Manage Emails
        </button>
      </div>

      {/* Create Automation Tab */}
      {activeTab === "create" && (
      <div className="mb-6 w-full max-w-md bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Email Options</h2>
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded border ${inputMode === "manual" ? "bg-purple-500 text-white" : "bg-white text-purple-500"}`}
            onClick={() => setInputMode("manual")}
          >
            One Email
          </button>
          <button
            className={`px-4 py-2 rounded border ${inputMode === "excel" ? "bg-green-500 text-white" : "bg-white text-green-500"}`}
            onClick={() => setInputMode("excel")}
          >
            Multiple Emails (Excel)
          </button>
        </div>
        <div className="mb-4 mt-2">
          <label className="block mb-2 font-medium">Select Email Template:</label>
          <select
            className="border rounded px-2 py-1 w-full"
            value={emailTemplate}
            onChange={e => setEmailTemplate(e.target.value)}
          >
            {EMAIL_TEMPLATES.map((tpl) => (
              <option key={tpl} value={tpl}>{tpl}</option>
            ))}
          </select>
        </div>
        {inputMode === "manual" && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">Email Address:</label>
            <input
              type="email"
              value={singleEmail}
              onChange={e => setSingleEmail(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              placeholder="Enter email address"
            />
          </div>
        )}
        {inputMode === "excel" && (
          <div className="mb-4">
            <label className="block mb-2 font-medium">Upload Excel File (.xlsx):</label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={e => setExcelFile(e.target.files[0])}
              className="border rounded px-2 py-1 w-full"
            />
            {excelFile && <p className="mt-2 text-sm">Selected: {excelFile.name}</p>}
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-2 font-medium">Email Body:</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            rows={4}
            placeholder="Enter email body"
          />
        </div>
        {/* Scheduling options depend on template */}
        <div className="mb-4">
          {isDailyTemplate && (
            <>
              <label className="block mb-2 font-medium">Time (every day):</label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </>
          )}

          {(isWeeklyTemplate || isMonthlyTemplate || isFollowUpTemplate) && (
            <>
              <label className="block mb-2 font-medium">Start date:</label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="border rounded px-2 py-1 w-full mb-2"
              />
              <label className="block mb-2 font-medium">Time:</label>
              <input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </>
          )}

          {!isDailyTemplate && !isWeeklyTemplate && !isMonthlyTemplate && !isFollowUpTemplate && (
            <p className="text-sm text-gray-500">No schedule needed for this template.</p>
          )}
        </div>
        <button
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow"
          disabled={inputMode === "excel" ? !excelFile : inputMode === "manual" ? !singleEmail : true}
          onClick={async () => {
            const url = API_BASE_URL;
            const scheduledAt = buildScheduledAt();
            if (inputMode === "excel" && excelFile) {
              const formData = new FormData();
              formData.append("type", selectedType);
              formData.append("template", emailTemplate);
              formData.append("body", body);
              if (scheduledAt) {
                formData.append("scheduledAt", scheduledAt);
              }
              formData.append("file", excelFile);
              await fetch(url + "/email/excel", { method: "POST", body: formData });
              alert("Excel submitted!");
            } else if (inputMode === "manual" && singleEmail) {
              await fetch(url + "/email/manual", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: selectedType,
                  template: emailTemplate,
                  body,
                  email: singleEmail,
                  scheduledAt: scheduledAt || null,
                }),
              });
              alert("Manual email submitted!");
            }
          }}
        >
          Send
        </button>
      </div>
      )}

      {/* Manage Emails Tab */}
      {activeTab === "manage" && (
        <div className="w-full max-w-6xl bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold mb-4">Manage Automated Emails</h2>
          {emailTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No automated emails found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Template</th>
                    <th className="px-4 py-2 text-left">Recipients</th>
                    <th className="px-4 py-2 text-left">Body Preview</th>
                    <th className="px-4 py-2 text-left">Next Run</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emailTasks.map((task) => (
                    <tr key={task.id} className="border-b hover:bg-gray-50">
                      {editingTask?.id === task.id ? (
                        <>
                          {/* Edit Mode */}
                          <td className="px-4 py-2">
                            <select
                              className="border rounded px-2 py-1 w-full"
                              value={editingTask.templateType}
                              onChange={(e) =>
                                setEditingTask({ ...editingTask, templateType: e.target.value })
                              }
                            >
                              {EMAIL_TEMPLATES.map((tpl) => (
                                <option key={tpl} value={tpl}>
                                  {tpl}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="border rounded px-2 py-1 w-full"
                              value={editingTask.recipients?.join(", ") || ""}
                              onChange={(e) =>
                                setEditingTask({
                                  ...editingTask,
                                  recipients: e.target.value.split(",").map((s) => s.trim()),
                                })
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <textarea
                              className="border rounded px-2 py-1 w-full"
                              rows={2}
                              value={editingTask.payload?.body || ""}
                              onChange={(e) =>
                                setEditingTask({
                                  ...editingTask,
                                  payload: { ...editingTask.payload, body: e.target.value },
                                })
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              className="border rounded px-2 py-1 w-full text-sm"
                              value={editingTask.nextRunDate || ""}
                              onChange={(e) =>
                                setEditingTask({ ...editingTask, nextRunDate: e.target.value })
                              }
                            />
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2 justify-center">
                              <button
                                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                                onClick={() => handleUpdateTask(task.id, editingTask)}
                              >
                                Save
                              </button>
                              <button
                                className="px-3 py-1 bg-gray-400 text-white rounded text-sm"
                                onClick={() => setEditingTask(null)}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          {/* View Mode */}
                          <td className="px-4 py-2">{task.templateType}</td>
                          <td className="px-4 py-2">
                            <div className="max-w-xs truncate" title={task.recipients?.join(", ")}>
                              {task.recipients?.join(", ") || "N/A"}
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <div className="max-w-sm truncate" title={task.payload?.body}>
                              {task.payload?.body || "N/A"}
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {task.nextRunDate
                              ? new Date(task.nextRunDate).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2 justify-center">
                              <button
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                                onClick={() => setEditingTask({ ...task })}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

