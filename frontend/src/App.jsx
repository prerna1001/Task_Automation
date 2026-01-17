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
  const [selectedType, setSelectedType] = useState("");
  const [inputMode, setInputMode] = useState("");
  const [singleEmail, setSingleEmail] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [emailTemplate, setEmailTemplate] = useState(EMAIL_TEMPLATES[0]);
  const [body, setBody] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api/automation";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Email Automation</h1>
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
        <button
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow"
          disabled={inputMode === "excel" ? !excelFile : inputMode === "manual" ? !singleEmail : true}
          onClick={async () => {
            const url = API_BASE_URL;
            if (inputMode === "excel" && excelFile) {
              const formData = new FormData();
              formData.append("type", selectedType);
              formData.append("template", emailTemplate);
              formData.append("body", body);
              formData.append("file", excelFile);
              await fetch(url + "/email/excel", { method: "POST", body: formData });
              alert("Excel submitted!");
            } else if (inputMode === "manual" && singleEmail) {
              await fetch(url + "/email/manual", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: selectedType, template: emailTemplate, body, email: singleEmail }),
              });
              alert("Manual email submitted!");
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;

