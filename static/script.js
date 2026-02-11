function sendCommand() {
    const input = document.getElementById("commandInput").value.trim();
    if (!input) return;
  
    document.getElementById("output").innerText = "Processing...";
  
    fetch("/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    })
      .then(response => response.json())
      .then(data => {
        typeAndThenSpeak(data.response);
      })
      .catch(error => {
        document.getElementById("output").innerText = "Error: " + error.message;
      });
  }
  
  // 🎤 Voice input
  function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.start();
  
    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById("commandInput").value = transcript;
      sendCommand();
    };
  
    recognition.onerror = function (event) {
      document.getElementById("output").innerText = "Voice Error: " + event.error;
    };
  }
  
  // 🔊 Text-to-Speech (after typing is done)
  function speakText(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    utterance.voice = voices.find(v => v.name.includes("Google") || v.default) || voices[0];
    utterance.rate = 1;
    synth.speak(utterance);
  }
  
  // ⌨️ Typing animation first, then speak
  function typeAndThenSpeak(text) {
    const output = document.getElementById("output");
    output.innerText = "";
    let index = 0;
  
    const typing = setInterval(() => {
      output.innerText += text.charAt(index);
      index++;
      if (index >= text.length) {
        clearInterval(typing);
        speakText(text); // Only speak after full typing
      }
    }, 40); // Adjust typing speed if needed
  }
  
  // 🧠 Initial greeting
  function initVoiceGreeting() {
    const greeting = "Hi boss, how can I help you?";
    typeAndThenSpeak(greeting);
  }
  
  // 🚀 On page load
  window.onload = () => {
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = initVoiceGreeting;
    } else {
      initVoiceGreeting();
    }
  };
  