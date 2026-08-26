/* =========================================================
   AI Chatbot Smart Version (Front-end only)
   - Health, BMI, fitness, medicine suggestion
   - Voice input + output (uses global speak from AI.js)
========================================================= */

const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");
const voiceChat = document.getElementById("voiceChat");

// ✅ Removed duplicate speak() — using the one from AI.js

// ========== Add Chat Bubble ==========
function addMessage(sender, text) {
    const bubble = document.createElement("div");
    bubble.className = `bubble ${sender}`;
    bubble.textContent = text;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ========== Handle User Query ==========
function handleQuery(query) {
    query = query.toLowerCase();
    let reply = "";

    if (query.includes("hello") || query.includes("hi")) {
        reply = "Hello  User !How can I help you today — health, fitness, or medicine?";
    } else if (query.includes("bukhar") || query.includes("fever")) {
        reply = "It seems you have fever. Take Paracetamol 500mg, rest well and stay hydrated. If it continues for 2+ days, visit the nearest doctor.";
    } else if (query.includes("cold") || query.includes("khansi") || query.includes("cough")) {
        reply = "Try warm water, steam, and ginger tea. If cough persists more than 3 days, consult a doctor.";
    } else if (query.includes("bmi")) {
        const bmi = parseFloat(document.getElementById("profileBMI") ? .textContent || "0");
        if (bmi && bmi > 0) {
            if (bmi < 18.5) reply = `Your BMI is ${bmi}. You are underweight. Eat more proteins and balanced meals.`;
            else if (bmi < 25) reply = `Your BMI is ${bmi}. You are healthy. Maintain your current routine.`;
            else reply = `Your BMI is ${bmi}. You are overweight. Focus on light exercise and low-fat diet.`;
        } else {
            reply = "Please calculate your BMI first using the Quick BMI form.";
        }
    } else if (query.includes("exercise") || query.includes("workout")) {
        reply = "Do light cardio, yoga, or a 30-minute walk daily. Consistency is key!";
    } else if (query.includes("diet") || query.includes("food")) {
        reply = "Eat fruits, vegetables, and protein-rich foods. Avoid junk and sugary drinks.";
    } else if (query.includes("dard") || query.includes("headache") || query.includes("pain")) {
        reply = "Take rest, drink water, and if pain is high take mild pain relief (like Crocin). If it continues, see a doctor.";
    } else if (query.includes("zyada") || query.includes("serious") || query.includes("bahut") || query.includes("bimar")) {
        reply = "Your condition seems serious. I suggest visiting the nearest hospital immediately. Map is shown below.";
    } else {
        reply = "Sorry, I didn’t understand that. You can ask about diet, BMI, or health issues.";
    }

    speak(reply); // using speak() from AI.js
    return reply;
}

// ========== Send Button ==========
sendChat.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage("user", text);
    chatInput.value = "";
    const reply = handleQuery(text);
    setTimeout(() => addMessage("bot", reply), 500);
});

// ========== Voice Recognition ==========
voiceChat.addEventListener("click", () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert("Voice recognition not supported in this browser");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        addMessage("user", transcript);
        const reply = handleQuery(transcript);
        setTimeout(() => addMessage("bot", reply), 500);
    };
});