
# SafeSpeak – Interactive Incident Reporting and Management System

### SWYNEX Frontend Developer Internship – Task 2

SafeSpeak is an interactive web application designed to demonstrate a simple and structured incident reporting process. Users can submit incident details, review reports, generate unique Case IDs, track reports and download complaint documents.

## Features

- **Incident Reporting:** Submit incident details through a structured form.
- **Form Validation:** Validate required fields before submission.
- **Voice Reporting:** Convert speech into text using browser speech recognition where supported.
- **Unique Case ID:** Generate a unique ID for every submitted report.
- **Report Tracking:** Search for reports using their Case IDs.
- **Dashboard:** View report statistics and recent submissions.
- **Report Management:** Search, edit and delete saved reports.
- **Evidence Preview:** Select and preview image files before proceeding.
- **Complaint PDF:** Generate and download a structured complaint document.
- **Dark Mode:** Switch between light and dark themes.
- **Responsive Design:** Access the application on different screen sizes.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser Local Storage
- Web Speech API
- jsPDF Library

## Application Workflow

1. Open the SafeSpeak homepage.
2. Enter incident details using the reporting form.
3. Review the submitted information.
4. Optionally select evidence for local preview.
5. View the complaint preview.
6. Download the complaint as a PDF.
7. Receive a unique Case ID.
8. Track and manage saved reports through the dashboard.

## Project Structure

```text
SWYNEX-Interactive-Web-Application/
│
├── index.html
├── report.html
├── review.html
├── evidence.html
├── complaint.html
├── success.html
├── dashboard.html
├── track.html
├── tips.html
├── style.css
├── script.js
└── README.md
```

## How to Run

1. Clone or download this repository.
2. Open the project folder.
3. Open `index.html` in a web browser.
4. Navigate through the application using the menu.

## Data Storage and Limitations

- This is a frontend demonstration project.
- Report data is stored in the browser using Local Storage.
- Data is not stored on a backend server.
- Evidence files are previewed locally and are not uploaded.
- The application does not provide official complaint submission or secure anonymous reporting services.

## Project Objective

To develop an interactive and user-friendly web application using reusable JavaScript functionality, form validation and browser-based state management.

---

**Developed as part of the SWYNEX Frontend Developer Internship – Task 2.**
