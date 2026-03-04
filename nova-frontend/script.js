// Add this at the top - CONNECT TO BACKEND
const API_URL = 'http://localhost:5001/api';

// Function to send voice to backend
async function sendToBackend(command) {
    try {
        const response = await fetch(`${API_URL}/voice/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command: command })
        });
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.log('Backend not available, using local responses');
        return null;
    }
}

// NOVA Voice Assistant - SINGLE MIC VERSION
console.log('🌟 NOVA starting...');

// Get all elements
const micButton = document.getElementById('micButton');
const micHint = document.getElementById('micHint');
const assistantMessage = document.getElementById('assistantMessage');
const userMessage = document.getElementById('userMessage');
const suggestionChips = document.querySelectorAll('.suggestion-chip');

// Create listening indicator (add it dynamically)
const listeningIndicator = document.createElement('div');
listeningIndicator.className = 'listening-indicator';
listeningIndicator.innerHTML = `
    <span class="listening-dot"></span>
    <span class="listening-text">LISTENING</span>
`;
micButton.parentNode.insertBefore(listeningIndicator, micButton.nextSibling);

console.log('✅ Elements loaded');

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    console.log('✅ Speech recognition ready');
} else {
    assistantMessage.querySelector('p').textContent = 'Please use Chrome browser for voice features';
    micButton.disabled = true;
    micButton.style.opacity = '0.5';
}

// Responses database
const responses = {
    'hello': 'Hello! How can I help you today?',
    'hi': 'Hi there! Great to see you!',
    'hey': 'Hey! What can I do for you?',
    'time': 'The current time is ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    'date': "Today's date is " + new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }),
    'joke': 'Why do programmers prefer dark mode? Because light attracts bugs! 😄',
    'how are you': "I'm doing fantastic! Thanks for asking! ⭐",
    'name': 'My name is NOVA - your voice assistant!',
    'weather': "I'd love to check the weather, but I need an API key for that!",
    'thank': "You're welcome! Happy to help! 😊",
    'thanks': "You're welcome! Happy to help! 😊",
    'good morning': 'Good morning! Hope you have a wonderful day! ☀️',
    'good afternoon': 'Good afternoon! How is your day going?',
    'good evening': 'Good evening! How can I assist you?',
    'good night': 'Good night! Sleep well! 🌙',
    'nova': 'Yes, I am NOVA! How can I shine for you today? ⭐'
};

// Default responses
const defaultResponses = [
    "Interesting! What else would you like to know?",
    "That's fascinating! Tell me more.",
    "I'm here to help! What can I do for you?",
    "Great! What else is on your mind?",
    "I'm listening! Please continue.",
    "Tell me something else!"
];

// Mic button click handler - SINGLE BUTTON
micButton.addEventListener('click', toggleListening);

function toggleListening() {
    if (!recognition) {
        alert('Please use Chrome browser for voice recognition');
        return;
    }
    
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
}

function startListening() {
    try {
        recognition.start();
        isListening = true;
        
        // Update UI - SINGLE MIC
        micButton.classList.add('listening');
        micButton.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        micHint.textContent = 'listening...';
        listeningIndicator.classList.add('active');
        assistantMessage.querySelector('p').textContent = '🎤 Listening...';
        
        console.log('🎤 Listening started');
    } catch (error) {
        console.error('Error:', error);
        if (error.message.includes('permission')) {
            alert('Please allow microphone access in Chrome');
        }
        resetUI();
    }
}

function stopListening() {
    try {
        recognition.stop();
    } catch (error) {
        console.error('Error stopping:', error);
    }
    resetUI();
}

function resetUI() {
    isListening = false;
    micButton.classList.remove('listening');
    micButton.innerHTML = '<i class="fas fa-microphone"></i>';
    micHint.textContent = 'tap to speak';
    listeningIndicator.classList.remove('active');
}

// Handle speech results
recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    console.log('User said:', speechResult);
    
    // Show user message
    userMessage.querySelector('p').textContent = `"${speechResult}"`;
    userMessage.classList.add('active');
    
    // Get response
    const response = getResponse(speechResult);
    
    // Show assistant response
    assistantMessage.querySelector('p').textContent = response;
    
    // Speak response
    speakResponse(response);
    
    stopListening();
};

recognition.onerror = (event) => {
    console.error('Recognition error:', event.error);
    
    let errorMsg = 'Error occurred. Please try again.';
    if (event.error === 'no-speech') {
        errorMsg = 'No speech detected. Please try again.';
    } else if (event.error === 'audio-capture') {
        errorMsg = 'Microphone not available. Check permissions.';
    } else if (event.error === 'not-allowed') {
        errorMsg = 'Please allow microphone access.';
    }
    
    assistantMessage.querySelector('p').textContent = errorMsg;
    resetUI();
};

recognition.onend = () => {
    if (isListening) {
        startListening();
    } else {
        resetUI();
    }
};

// Generate response
function getResponse(input) {
    input = input.toLowerCase().trim();
    
    // Check for keywords
    for (let key in responses) {
        if (input.includes(key)) {
            return responses[key];
        }
    }
    
    // Return random default response
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Text to speech
function speakResponse(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        window.speechSynthesis.speak(utterance);
    }
}

// Suggestion chips
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-text');
        
        // Show user message
        userMessage.querySelector('p').textContent = `"${text}"`;
        userMessage.classList.add('active');
        
        // Get and show response
        const response = getResponse(text);
        assistantMessage.querySelector('p').textContent = response;
        
        // Speak response
        speakResponse(response);
    });
});

// Set initial message
assistantMessage.querySelector('p').textContent = "Interesting! What else would you like to know?";

console.log('✅ NOVA ready!');