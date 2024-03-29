const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.static('.')); // Serving static files from the root directory

// Serve the HTML file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'im-feeling-lucky-frame.html'));
});

app.get('/lucky', async (req, res) => {
    try {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any', {
            params: {
                blacklistFlags: 'racist',
                // Removed the 'type' parameter to fetch both single and two-part jokes
            }
        });

        if (response.data) {
            let jokeMessage = '';
            // Constructing the joke message based on its type
            if (response.data.joke) {
                jokeMessage = response.data.joke; // For single-part jokes
            } else if (response.data.setup && response.data.delivery) {
                jokeMessage = `${response.data.setup} ... ${response.data.delivery}`; // For two-part jokes
            }

            res.json({ message: jokeMessage });
        } else {
            res.json({ message: 'No joke found, try again!' });
        }
    } catch (error) {
        console.error('Error fetching joke:', error);
        res.status(500).json({ message: 'Failed to fetch joke, please try again later.', error: error.message });
    }
});

// Listen on the port only when not in Vercel's environment
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3001; // Using 3001 as the default port for local development
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
