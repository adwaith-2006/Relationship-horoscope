// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000; // Use PORT from .env or default to 3000

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Horoscope messages (12 in total: 4 per tone)
const horoscopes = {
  romantic: [
    "The stars have aligned for you and your partner. 💖 Love is blooming in magical ways today!",
    "A dreamy connection surrounds you both. 🌹 Let your hearts guide the way.",
    "Cosmic forces are in your favor. ✨ Enjoy the warmth of your bond!",
    "Love is in the air. 💫 Cherish every enchanting moment together."
  ],
  funny: [
    "Your love is like a pizza: cheesy, irresistible, and best shared! 🍕",
    "Beware of the remote! 😂 Your love story is full of playful battles.",
    "Your connection is like a meme: makes everyone laugh, but no one knows why! 😆",
    "Warning: you may break out into spontaneous giggles at any moment. 🤪"
  ],
  mysterious: [
    "The universe whispers secrets only your hearts can hear. 🌙",
    "A hidden adventure awaits you both. 🔮 The stars know more than you do.",
    "The cosmos has woven a mysterious path for you. ✨ Follow the clues!",
    "In the quiet of the night, destiny calls you through hidden wonders. 🌌"
  ]
};

// POST endpoint for generating horoscopes
// This connects to the front-end form that sends:
// { yourName: "John", partnerName: "Jane", tone: "Romantic" }
app.post('/generate', (req, res) => {
    try {
        const { yourName, partnerName, tone } = req.body;

        // Validate required fields
        if (!yourName || !partnerName || !tone) {
            return res.status(400).json({ 
                error: "Missing required fields",
                horoscope: "Please provide both names and select a tone! 💫"
            });
        }

        // Get the appropriate messages based on the selected tone
        const messages = horoscopes[tone.toLowerCase()];
        if (!messages) {
            return res.status(400).json({
                error: "Invalid tone! Please choose 'romantic', 'funny', or 'mysterious'.",
                horoscope: "Invalid tone selected! 💔"
            });
        }

        // Pick a random message from the chosen tone
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // Generate a "love meter" percentage
        const loveMeter = calculateLoveMeter(yourName, partnerName);

        // Return the horoscope with love meter
        res.json({
            horoscope: randomMessage,
            loveMeter: loveMeter,
            tone: tone
        });

    } catch (error) {
        console.error('Error generating horoscope:', error.message);
        res.status(500).json({ 
            horoscope: "Something went wrong! 💔 The cosmic energies are misaligned. Please try again.",
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: '✨ Relationship Horoscope API is ready for love readings! ✨',
        timestamp: new Date().toISOString()
    });
});

// Love meter calculator
function calculateLoveMeter(name1, name2) {
    // Simple but effective algorithm
    const combined = (name1 + name2).toLowerCase().replace(/\s+/g, '');
    
    // Use a more distributed algorithm
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
        hash = ((hash << 5) - hash) + combined.charCodeAt(i);
        hash |= 0; // Convert to 32-bit integer
    }
    
    // Get positive value between 30-99
    const percentage = (Math.abs(hash) % 70) + 30;
    
    // Bonus for same starting letter
    if (name1[0].toLowerCase() === name2[0].toLowerCase()) {
        return Math.min(percentage + 10, 100);
    }
    
    // Bonus for same length names
    if (name1.length === name2.length) {
        return Math.min(percentage + 5, 100);
    }
    
    // Bonus for palindrome-ish names (one name contains the other)
    if (name1.toLowerCase().includes(name2.toLowerCase()) || 
        name2.toLowerCase().includes(name1.toLowerCase())) {
        return Math.min(percentage + 8, 100);
    }
    
    return percentage;
}

// Start the server
app.listen(PORT, () => {
    console.log(`✨ Relationship Horoscope backend running on http://localhost:${PORT} ✨`);
    console.log(`📡 POST endpoint: http://localhost:${PORT}/generate`);
});

// Export for testing
module.exports = app;
