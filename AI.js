/* =========================================================
   AI Universal Health Dashboard — Smart Chatbot Version
   -------------------------------------------------------
   ✅ Combined Features:
   - Profile + Quick BMI + Health Score + Fitness Level
   - Role-based Routines
   - Voice Input (STT) + Speech Output (TTS)
   - Smart Chatbot (Health, Fitness, Medicine)
   - Camera Capture + Fingerprint Demo
   ========================================================= */

// ---------- 🔹 Helper Functions ----------
const $ = id => document.getElementById(id);

const speak = (txt) => {
  try {
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) {
    console.error(e);
  }
};

// ---------- 🔹 Profile Section ----------
const profileHeight = 159; // cm
const profileWeight = 45;  // kg

function initProfile() {
  if ($('profileHeight')) $('profileHeight').innerText = profileHeight;
  if ($('profileWeight')) $('profileWeight').innerText = profileWeight;
  calcAndShowProfileBMI();
}

// ---------- 🔹 BMI Calculation ----------
function calculateBMI(weight, height) {
  if (!weight || !height) return 0;
  return +(weight / ((height / 100) ** 2)).toFixed(1);
}

// ---------- 🔹 Health Score & Fitness ----------
function getHealthScoreAndFitnessLevel(bmi) {
  let score, level;
  if (bmi < 18.5) {
    score = 55;
    level = "Underweight / 🟡 Needs Improvement (Poor)";
  } else if (bmi >= 18.5 && bmi < 25) {
    score = 95;
    level = "Fit / 🟢 Excellent";
  } else if (bmi >= 25 && bmi < 30) {
    score = 75;
    level = "Overweight / 🟠 Average";
  } else {
    score = 50;
    level = "Obese / 🔴 Poor";
  }
  return { score, level };
}

// ---------- 🔹 Profile BMI + Health ----------
function calcAndShowProfileBMI() {
  const h = profileHeight, w = profileWeight;
  const bmi = calculateBMI(w, h);
  if ($('profileBMI')) $('profileBMI').innerText = bmi;

  const { score, level } = getHealthScoreAndFitnessLevel(bmi);
  if ($('healthScore')) $('healthScore').textContent = `${score}/100`;
  if ($('fitnessLevel')) $('fitnessLevel').textContent = level;

  drawChart(bmi);
}

// ---------- 🔹 Quick BMI Form ----------
if ($('btnQuickBMI')) {
  $('btnQuickBMI').addEventListener('click', () => {
    const name = $('quickName').value.trim();
    const age = $('quickAge').value.trim();
    const gender = $('quickGender').value;
    const h = parseFloat($('quickHeight').value);
    const w = parseFloat($('quickWeight').value);
    const result = $('quickResult');

    if (!name || !age || !gender || !h || !w) {
      result.textContent = "⚠️ Please fill all fields (Name, Age, Gender, Height, Weight)";
      result.style.color = "red";
      return;
    }

    const bmi = calculateBMI(w, h);
    const { score, level } = getHealthScoreAndFitnessLevel(bmi);

    result.style.color = "#000";
    result.innerHTML = `
      <b>${name}</b> (${age} yrs, ${gender})<br>
      Height: ${h} cm • Weight: ${w} kg<br>
      <b>BMI:</b> ${bmi}<br>
      Health Score: <b>${score}/100</b><br>
      Fitness Level: <b>${level}</b>
    `;

    drawChart(bmi);
  });
}

if ($('btnQuickClear')) {
  $('btnQuickClear').addEventListener('click', () => {
    ['quickName', 'quickAge', 'quickGender', 'quickHeight', 'quickWeight'].forEach(id => {
      const el = $(id);
      if (el) el.value = "";
    });
    const result = $('quickResult');
    result.textContent = "Enter details and press Check BMI";
    result.style.color = "#555";
  });
}

// ---------- 🔹 BMI Chart (Chart.js) ----------
let chartInstance = null;
function drawChart(bmi) {
  const canvas = $('chartBMI');
  if (!canvas) return;
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Your BMI', 'Remaining'],
      datasets: [{
        data: [bmi, Math.max(0, 40 - bmi)],
        backgroundColor: ['#0b84ff', '#e6f6ff'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '70%',
      plugins: { legend: { display: false } },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

// ---------- 🔹 Role-based Routine ----------
const routines = {
  common: {
    male: {
      morning: ['Oats/Poha + Milk', 'Fruit', 'Stretch 10 min'],
      afternoon: ['Roti/Rice + Dal', 'Salad'],
      evening: ['Walk 30 min', 'Light dinner']
    },
    female: {
      morning: ['Upma/Oats + Milk', 'Fruit'],
      afternoon: ['Roti/Rice + Paneer', 'Salad'],
      evening: ['Yoga 20 min', 'Light dinner']
    }
  }
};

function loadRoutine() {
  const role = $('roleSelect')?.value || 'common';
  const gender = $('genderSelect')?.value || 'male';
  const area = $('routineArea');
  if (!area) return;

  area.innerHTML = '';
  const data = routines[role]?.[gender] || routines.common.male;

  for (const [part, items] of Object.entries(data)) {
    const card = document.createElement('div');
    card.className = 'routineCard';
    card.innerHTML = `
      <h4>${part}</h4>
      <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
    `;
    area.appendChild(card);
  }
}
if ($('btnLoadRoutine')) $('btnLoadRoutine').addEventListener('click', loadRoutine);

// ---------- 🔹 Smart Chatbot ----------
function addMessage(sender, text) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${sender}`;
  bubble.textContent = text;
  $('chatBox').appendChild(bubble);
  $('chatBox').scrollTop = $('chatBox').scrollHeight;
}

function handleQuery(query) {
  query = query.toLowerCase();
  let reply = "";

  if (query.includes("hello") || query.includes("hi")) {
    reply = "Hello Sahil! How can I help you today — health, fitness, or medicine?";
  } else if (query.includes("fever") || query.includes("bukhar")) {
    reply = "It seems you have fever. Take Paracetamol 500mg, rest and drink fluids.";
  } else if (query.includes("cold") || query.includes("cough")) {
    reply = "Try warm water, steam, and ginger tea. If cough persists 3+ days, see a doctor.";
  } else if (query.includes("bmi")) {
    const bmi = parseFloat($('profileBMI')?.textContent || "0");
    if (bmi && bmi > 0) {
      const { level } = getHealthScoreAndFitnessLevel(bmi);
      reply = `Your BMI is ${bmi}. You are ${level}.`;
    } else reply = "Please calculate your BMI first using Quick BMI.";
  } else if (query.includes("exercise")) {
    reply = "Do light cardio, yoga, or 30-min walk daily.";
  } else if (query.includes("diet")) {
    reply = "Eat fruits, vegetables, and protein-rich meals. Avoid junk.";
  } else if (query.includes("pain") || query.includes("dard")) {
    reply = "Take rest, drink water, and mild pain relief if needed.";
  } else if (query.includes("serious") || query.includes("hospital")) {
    reply = "This sounds serious. Please visit the nearest hospital immediately.";
  } else {
    reply = "I can help with diet, BMI, exercise, and common health advice.";
  }

  speak(reply);
  return reply;
}

if ($('sendChat')) {
  $('sendChat').addEventListener('click', () => {
    const text = $('chatInput').value.trim();
    if (!text) return;
    addMessage("user", text);
    $('chatInput').value = "";
    const reply = handleQuery(text);
    setTimeout(() => addMessage("bot", reply), 500);
  });
}

// ---------- 🔹 Voice Recognition ----------
if ($('voiceChat')) {
  $('voiceChat').addEventListener('click', () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      addMessage('bot', 'Voice not supported in this browser.');
      return;
    }
    const rec = new SpeechRec();
    rec.lang = 'hi-IN';
    rec.start();
    addMessage('bot', '🎤 Listening...');

    rec.onresult = e => {
      const transcript = e.results[0][0].transcript;
      addMessage('user', transcript);
      const reply = handleQuery(transcript);
      setTimeout(() => addMessage('bot', reply), 500);
    };
    rec.onerror = () => addMessage('bot', 'Voice recognition error.');
  });
}

// ---------- 🔹 Camera + Fingerprint ----------
let stream = null;
if ($('startCam')) {
  $('startCam').addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      $('camera').srcObject = stream;
      $('photoPreview').textContent = "Camera started...";
    } catch {
      addMessage('bot', '⚠️ Camera access denied.');
    }
  });
}

if ($('stopCam')) {
  $('stopCam').addEventListener('click', () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      $('camera').srcObject = null;
      $('photoPreview').textContent = "Camera stopped.";
      addMessage('bot', '🛑 Camera stopped successfully.');
      stream = null;
    }
  });
}

if ($('snap')) {
  $('snap').addEventListener('click', () => {
    const v = $('camera');
    if (!v || !v.videoWidth) return addMessage('bot', 'Start camera first.');
    const c = document.createElement('canvas');
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    const data = c.toDataURL('image/png');
    $('photoPreview').innerHTML = `<img src="${data}" alt="Captured" style="width:100%;border-radius:8px">`;
    addMessage('bot', '📸 Photo captured successfully.');
  });
}

if ($('finger')) {
  $('finger').addEventListener('click', () => {
    const el = $('finger');
    el.style.transform = 'scale(.95)';
    setTimeout(() => {
      el.style.transform = '';
      addMessage('bot', '🔒 Fingerprint scanned (demo). Profile matched.');
      speak('Fingerprint scanned successfully.');
    }, 800);
  });
}

// ---------- 🔹 On Page Load ----------
window.addEventListener('DOMContentLoaded', () => {
  initProfile();
  loadRoutine();
});
