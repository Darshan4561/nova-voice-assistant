const express = require('express');
const router = express.Router();

// Intelligent response database
const responses = {
    greetings: [
        'Hello! How can I help you today?',
        'Hi there! Great to see you!',
        'Hey! What can I do for you?',
        'Greetings! How may I assist you?'
    ],
    time: [
        'The current time is ',
        'It is currently '
    ],
    date: [
        "Today's date is ",
        "It is "
    ],
    jokes: [
        'Why do programmers prefer dark mode? Because light attracts bugs! 😄',
        'Why did the developer go broke? Because he used up all his cache!',
        'What do you call a fake noodle? An impasta!',
        'Why did the scarecrow win an award? Because he was outstanding in his field!',
        'What do you call a bear with no teeth? A gummy bear! 🐻'
    ],
    howAreYou: [
        "I'm doing fantastic! Thanks for asking! ⭐",
        "I'm great! Ready to help you!",
        "All systems operational! How about you?",
        "I'm wonderful! What can I do for you?"
    ],
    name: [
        'My name is NOVA!',
        'I am NOVA, your voice assistant!',
        'Call me NOVA!'
    ],
    weather: [
        "I'd love to check the weather, but I need an API key for that!",
        "Weather updates coming soon!",
        "Check back later for weather features!"
    ],
    thanks: [
        "You're welcome! Happy to help! 😊",
        "Anytime! That's what I'm here for!",
        "Glad I could assist!",
        "You're welcome! 😊"
    ],
    timeOfDay: {
        morning: [
            'Good morning! Hope you have a wonderful day! ☀️',
            'Good morning! Ready to start the day?',
            'Morning! How can I help you today?'
        ],
        afternoon: [
            'Good afternoon! How is your day going?',
            'Afternoon! What can I do for you?',
            'Good afternoon! Staying productive?'
        ],
        evening: [
            'Good evening! How can I assist you?',
            'Evening! What's on your mind?',
            'Good evening! Winding down?'
        ],
        night: [
            'Good night! Sleep well! 🌙',
            'Good night! Sweet dreams!',
            'Night! Rest well!'
        ]
    },
    default: [
        "Interesting! Tell me more about that.",
        "That's fascinating! What else?",
        "I'm listening! Please continue.",
        "Great! What else is on your mind?",
        "Tell me something else!",
        "I'm here to help! What can I do for you?"
    ],
    nova: [
        'Yes, I am NOVA! How can I shine for you today? ⭐',
        'NOVA at your service!',
        'That\'s me! NOVA voice assistant!'
    ]
};

// Process voice command
router.post('/command', (req, res) => {
    try {
        const { command, userId, language = 'en' } = req.body;
        
        if (!command) {
            return res.status(400).json({
                error: 'No command provided'
            });
        }

        console.log('🎤 Voice command received:', command);
        console.log('👤 User ID:', userId || 'anonymous');
        console.log('🌐 Language:', language);

        // Generate response
        const response = generateResponse(command);
        
        // Get time-based greeting if applicable
        const timeBased = getTimeBasedGreeting();

        // Return response
        res.json({
            success: true,
            command: command,
            response: response,
            timestamp: new Date().toISOString(),
            language: language,
            timeBased: timeBased
        });

    } catch (error) {
        console.error('Error processing voice command:', error);
        res.status(500).json({
            error: 'Failed to process voice command',
            message: error.message
        });
    }
});

// Get conversation history
router.get('/history/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 10 } = req.query;

        // Mock history data (replace with database later)
        const mockHistory = [
            {
                id: 1,
                user: 'Hello NOVA',
                assistant: 'Hello! How can I help you today?',
                timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: 2,
                user: 'What time is it?',
                assistant: The current time is ,
                timestamp: new Date(Date.now() - 1800000).toISOString()
            },
            {
                id: 3,
                user: 'Tell me a joke',
                assistant: 'Why do programmers prefer dark mode? Because light attracts bugs!',
                timestamp: new Date(Date.now() - 900000).toISOString()
            }
        ];

        res.json({
            success: true,
            userId: userId,
            history: mockHistory.slice(0, limit),
            total: mockHistory.length
        });

    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({
            error: 'Failed to fetch history',
            message: error.message
        });
    }
});

// Clear conversation history
router.delete('/history/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        
        // Mock clear operation
        console.log(Clearing history for user: );

        res.json({
            success: true,
            message: 'Conversation history cleared',
            userId: userId
        });

    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({
            error: 'Failed to clear history',
            message: error.message
        });
    }
});

// Get time-based greeting
function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        return 'morning';
    } else if (hour >= 12 && hour < 17) {
        return 'afternoon';
    } else if (hour >= 17 && hour < 21) {
        return 'evening';
    } else {
        return 'night';
    }
}

// Generate intelligent response
function generateResponse(command) {
    const input = command.toLowerCase().trim();
    
    // Check for greetings
    if (input.match(/^(hello|hi|hey|greetings|sup|yo)/i)) {
        const greeting = responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
        const timeOfDay = getTimeBasedGreeting();
        const timeGreeting = responses.timeOfDay[timeOfDay][Math.floor(Math.random() * responses.timeOfDay[timeOfDay].length)];
        return Math.random() > 0.5 ? greeting : timeGreeting;
    }
    
    // Check for time
    if (input.includes('time') || input.includes('clock') || input.includes('what time')) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        const prefix = responses.time[Math.floor(Math.random() * responses.time.length)];
        return prefix + timeStr;
    }
    
    // Check for date
    if (input.includes('date') || input.includes('day') || input.includes('today')) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const prefix = responses.date[Math.floor(Math.random() * responses.date.length)];
        return prefix + dateStr;
    }
    
    // Check for jokes
    if (input.includes('joke') || input.includes('funny') || input.includes('laugh')) {
        return responses.jokes[Math.floor(Math.random() * responses.jokes.length)];
    }
    
    // Check for "how are you"
    if (input.includes('how are you') || input.includes('how do you do')) {
        return responses.howAreYou[Math.floor(Math.random() * responses.howAreYou.length)];
    }
    
    // Check for name
    if (input.includes('your name') || input.includes('who are you') || input.includes('what are you')) {
        return responses.name[Math.floor(Math.random() * responses.name.length)] + ' ' + 
               responses.nova[Math.floor(Math.random() * responses.nova.length)];
    }
    
    // Check for weather
    if (input.includes('weather') || input.includes('temperature') || input.includes('forecast')) {
        return responses.weather[Math.floor(Math.random() * responses.weather.length)];
    }
    
    // Check for thanks
    if (input.includes('thank') || input.includes('thanks') || input.includes('appreciate')) {
        return responses.thanks[Math.floor(Math.random() * responses.thanks.length)];
    }
    
    // Check for good morning/afternoon/evening/night
    if (input.includes('good morning')) {
        return responses.timeOfDay.morning[Math.floor(Math.random() * responses.timeOfDay.morning.length)];
    }
    if (input.includes('good afternoon')) {
        return responses.timeOfDay.afternoon[Math.floor(Math.random() * responses.timeOfDay.afternoon.length)];
    }
    if (input.includes('good evening')) {
        return responses.timeOfDay.evening[Math.floor(Math.random() * responses.timeOfDay.evening.length)];
    }
    if (input.includes('good night')) {
        return responses.timeOfDay.night[Math.floor(Math.random() * responses.timeOfDay.night.length)];
    }
    
    // Check for NOVA
    if (input.includes('nova')) {
        return responses.nova[Math.floor(Math.random() * responses.nova.length)];
    }
    
    // Default response
    return responses.default[Math.floor(Math.random() * responses.default.length)];
}

module.exports = router;
