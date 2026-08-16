// Sample Masterlist Database
const masterlist = [
  { id: "STU-001", name: "Juan Dela Cruz", section: "Section 1", phone: "09123456789" },
  { id: "STU-002", name: "Maria Santos", section: "Section 2", phone: "09987654321" },
  { id: "STU-003", name: "Pedro Penduko", section: "Section 1", phone: "09112223334" },
  { id: "STU-004", name: "Ana Reyes", section: "Section 2", phone: "09556667778" }
];

const scannedIDs = new Set();

function onScanSuccess(decodedText) {
  const student = masterlist.find(s => s.id === decodedText);
  const statusBox = document.getElementById('statusMessage');

  if (!student) {
    statusBox.innerText = `❌ ID not found: ${decodedText}`;
    statusBox.style.color = "red";
    return;
  }

  if (scannedIDs.has(student.id)) {
    statusBox.innerText = `⚠️ ${student.name} is already scanned.`;
    statusBox.style.color = "orange";
    return;
  }

  scannedIDs.add(student.id);
  const timeIn = new Date().toLocaleTimeString();

  // Auto-Sort to respective table
  const targetTableId = student.section === "Section 1" ? "logs-section-1" : "logs-section-2";
  const tableBody = document.getElementById(targetTableId);

  const newRow = `
    <tr>
      <td><b>${student.name}</b></td>
      <td>${timeIn}</td>
      <td><span style="color:green;">Present</span></td>
    </tr>
  `;
  tableBody.innerHTML += newRow;

  statusBox.innerText = `✅ ${student.name} scanned -> Sorted to ${student.section}`;
  statusBox.style.color = "green";

  // Trigger SMS Alert Logic Here
  sendParentSMS(student.name, student.phone, timeIn);
}

function sendParentSMS(name, phone, time) {
  console.log(`[SMS Gateway Triggered] Sent to ${phone}: ${name} arrived at ${time}.`);
}

let html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);
