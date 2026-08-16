const masterlist = [
  { id: "STU-001", name: "Juan Dela Cruz", section: "Section 1", photo: "https://i.imgur.com/7vU3k3X.jpg" },
  { id: "STU-002", name: "Maria Santos", section: "Section 2", photo: "https://i.imgur.com/2D5a7eD.jpg" }
];

const scannedIDs = new Set();
let currentMode = "QR";
let qrScanner;

// Initialize QR Scanner
function startQRScanner() {
  document.getElementById("reader").style.display = "block";
  document.getElementById("video").style.display = "none";
  
  if (!qrScanner) {
    qrScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 220 });
    qrScanner.render(onScanSuccess);
  }
  document.getElementById("statusMessage").innerText = "Ready to scan QR Code...";
}

// Mode Switcher
function setMode(mode) {
  currentMode = mode;
  document.getElementById("btnQR").classList.toggle("active-btn", mode === 'QR');
  document.getElementById("btnFace").classList.toggle("active-btn", mode === 'FACE');

  if (mode === "QR") {
    startQRScanner();
  } else {
    document.getElementById("reader").style.display = "none";
    document.getElementById("video").style.display = "block";
    document.getElementById("statusMessage").innerText = "Face Recognition Mode Selected.";
  }
}

function onScanSuccess(decodedText) {
  const student = masterlist.find(s => s.id === decodedText);
  if (student) registerAttendance(student, "QR Code");
}

function registerAttendance(student, method) {
  const statusBox = document.getElementById('statusMessage');

  if (scannedIDs.has(student.id)) {
    statusBox.innerText = `⚠️ ${student.name} is already logged.`;
    statusBox.style.color = "orange";
    return;
  }

  scannedIDs.add(student.id);
  const timeIn = new Date().toLocaleTimeString();
  const targetTable = student.section === "Section 1" ? "logs-section-1" : "logs-section-2";

  document.getElementById(targetTable).innerHTML += `
    <tr>
      <td><b>${student.name}</b></td>
      <td>${timeIn}</td>
      <td><small>${method}</small></td>
    </tr>
  `;

  statusBox.innerText = `✅ [${method}] ${student.name} -> Sorted to ${student.section}`;
  statusBox.style.color = "green";
}

// Start default mode
startQRScanner();
