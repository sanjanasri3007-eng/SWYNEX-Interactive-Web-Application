
const STORAGE_KEY = "safeSpeakReports";

function getReports() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveReports(reports) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function generateID() {
    let id;
    const reports = getReports();

    do {
        id = "SS-" + Math.floor(100000 + Math.random() * 900000);
    } while (reports.some(report => report.id === id));

    return id;
}

function quickExit() {
    window.location.replace("https://www.google.com");
}

function saveReport() {
    const category = document.getElementById("category").value.trim();
    const date = document.getElementById("date").value;
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!category || !date || !location || !description) {
        alert("Please complete all fields before continuing.");
        return;
    }

    const incidentDate = new Date(date + "T00:00:00");
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (Number.isNaN(incidentDate.getTime()) || incidentDate > today) {
        alert("Please enter a valid incident date.");
        return;
    }

    const report = {
        id: generateID(),
        category,
        date,
        location,
        description,
        status: "Submitted",
        createdAt: new Date().toISOString()
    };

    const reports = getReports();
    reports.push(report);
    saveReports(reports);

    localStorage.setItem("currentCaseID", report.id);
    localStorage.setItem("category", category);
    localStorage.setItem("date", date);
    localStorage.setItem("location", location);
    localStorage.setItem("description", description);

    window.location.href = "review.html";
}

function generateCaseID() {
    const id = localStorage.getItem("currentCaseID") || "Not Generated";
    const element = document.getElementById("caseID");

    if (element) {
        element.textContent = "Case ID: " + id;
    }
}

function trackReport() {
    const input = document.getElementById("caseInput");
    const statusBox = document.getElementById("statusBox");
    const statusText = document.getElementById("statusText");

    if (!input || !statusBox || !statusText) return;

    const enteredID = input.value.trim().toUpperCase();

    if (!enteredID) {
        alert("Please enter your Case ID.");
        return;
    }

    const report = getReports().find(item => item.id === enteredID);

    statusBox.style.display = "block";

    if (report) {
        statusText.textContent =
            "Case ID: " + report.id +
            " | Category: " + report.category +
            " | Status: " + report.status;
    } else {
        statusText.textContent = "No report found with this Case ID.";
    }
}

function updateDashboard() {
    const reports = getReports();
    const total = document.getElementById("totalReports");
    const latest = document.getElementById("latestCase");
    const category = document.getElementById("reportCategory");
    const date = document.getElementById("incidentDate");
    const location = document.getElementById("incidentLocation");

    if (total) total.textContent = reports.length;

    const recent = reports[reports.length - 1];

    if (latest) latest.textContent = recent ? recent.id : "No Report";
    if (category) category.textContent = recent ? recent.category : "-";
    if (date) date.textContent = recent ? recent.date : "-";
    if (location) location.textContent = recent ? recent.location : "-";
}

function deleteReport(id) {
    if (!confirm("Are you sure you want to delete this report?")) return;

    const reports = getReports().filter(report => report.id !== id);
    saveReports(reports);
    displayReports();
    updateDashboard();
}

function editReport(id) {
    const reports = getReports();
    const report = reports.find(item => item.id === id);

    if (!report) return;

    const category = prompt("Enter updated category:", report.category);
    if (category === null || !category.trim()) return;

    const location = prompt("Enter updated location:", report.location);
    if (location === null || !location.trim()) return;

    report.category = category.trim();
    report.location = location.trim();

    saveReports(reports);
    displayReports();
    updateDashboard();
    alert("Report updated successfully.");
}

function displayReports() {
    const container = document.getElementById("reportList");
    if (!container) return;

    const reports = getReports();
    container.textContent = "";

    if (reports.length === 0) {
        container.textContent = "No reports available.";
        return;
    }

    reports.forEach(report => {
        const card = document.createElement("div");
        card.className = "card";

        const heading = document.createElement("h2");
        heading.textContent = report.id;

        const details = document.createElement("p");
        details.textContent =
            report.category + " | " + report.date +
            " | " + report.location + " | " + report.status;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editReport(report.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteReport(report.id);

        card.append(heading, details, editButton, deleteButton);
        container.appendChild(card);
    });
}

function filterReports() {
    const search = document.getElementById("reportSearch");
    const filter = search ? search.value.toLowerCase() : "";
    const container = document.getElementById("reportList");

    if (!container) return;

    container.textContent = "";

    const reports = getReports().filter(report =>
        report.id.toLowerCase().includes(filter) ||
        report.category.toLowerCase().includes(filter) ||
        report.status.toLowerCase().includes(filter)
    );

    reports.forEach(report => {
        const card = document.createElement("div");
        card.className = "card";

        const heading = document.createElement("h2");
        heading.textContent = report.id;

        const details = document.createElement("p");
        details.textContent = report.category + " | " + report.status;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editReport(report.id);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteReport(report.id);

        card.append(heading, details, editButton, deleteButton);
        container.appendChild(card);
    });

    if (reports.length === 0) {
        container.textContent = "No matching reports found.";
    }
}

function startListening() {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice recognition is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = event => {
        document.getElementById("description").value =
            event.results[0][0].transcript;
    };

    recognition.onerror = () => alert("Voice recognition failed.");
    recognition.start();
}

function downloadComplaint() {
    if (!window.jspdf) {
        alert("PDF library is unavailable.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const caseID = localStorage.getItem("currentCaseID") || "Not Generated";
    const category = localStorage.getItem("category") || "";
    const date = localStorage.getItem("date") || "";
    const location = localStorage.getItem("location") || "";
    const description = localStorage.getItem("description") || "";

    doc.setFontSize(20);
    doc.text("SafeSpeak", 20, 20);
    doc.setFontSize(12);

    const lines = doc.splitTextToSize(
        "Case ID: " + caseID +
        "\nCategory: " + category +
        "\nIncident Date: " + date +
        "\nLocation: " + location +
        "\n\nDescription:\n" + description,
        170
    );

    doc.text(lines, 20, 40);
    doc.save("SafeSpeak_Complaint.pdf");
}

function downloadAndFinish() {
    downloadComplaint();
    window.location.href = "success.html";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
}

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }

    const fields = {
        reviewCategory: "category",
        reviewDate: "date",
        reviewLocation: "location",
        reviewDescription: "description"
    };

    Object.entries(fields).forEach(([elementID, storageKey]) => {
        const element = document.getElementById(elementID);
        if (element) {
            element.textContent =
                localStorage.getItem(storageKey) || "Not Provided";
        }
    });

    const complaintText = document.getElementById("complaintText");

    if (complaintText) {
        complaintText.textContent =
            "Subject: Complaint regarding " +
            (localStorage.getItem("category") || "") +
            "\n\nIncident Date: " + (localStorage.getItem("date") || "") +
            "\nLocation: " + (localStorage.getItem("location") || "") +
            "\n\nIncident Details:\n" +
            (localStorage.getItem("description") || "");
    }

    updateDashboard();
    displayReports();
});
