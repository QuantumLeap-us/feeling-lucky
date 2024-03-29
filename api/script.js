/*!
 * Copyright (c) 2024 Jams2blues Creations LLC
 * 
 * This software is provided 'as-is', without any express or implied warranty. In no event will the authors be held liable for any damages arising from the use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose, including commercial applications, and to alter it and redistribute it freely, subject to the following restrictions:
 * 
 * 1. The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use this software in a product, an acknowledgment in the product documentation would be appreciated but is not required.
 * 2. Altered source versions must be plainly marked as such, and must not be misrepresented as being the original software.
 * 3. This notice may not be removed or altered from any source distribution.
 */

// Include the Express module
const express = require('express');
const axios = require('axios');
const path = require('path');

// Create an Express application
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/lucky', async (req, res) => {
    try {
        const jokeApiResponse = await axios.get('https://v2.jokeapi.dev/joke/Any', {
            params: {
                blacklistFlags: 'racist', // Add any other parameters you wish to include
            }
        });

        // Check the structure of the joke and respond accordingly
        if (jokeApiResponse.data.type === 'single') {
            res.json({ joke: jokeApiResponse.data.joke });
        } else if (jokeApiResponse.data.type === 'twopart') {
            res.json({ setup: jokeApiResponse.data.setup, delivery: jokeApiResponse.data.delivery });
        } else {
            // Respond with a generic message if no joke was found
            res.json({ message: 'No joke found, try again!' });
        }
    } catch (error) {
        // Log the error and send a 500 server error status code with a message
        console.error('Error fetching joke:', error);
        res.status(500).json({ message: 'Failed to fetch joke, please try again later.' });
    }
});

// Serve the HTML file for all other routes to enable client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start the server only if it's not running through Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3001; // Default to port 3001 if no environment port is specified
    app.listen(PORT, () => {
        console.log(`Server is up and running on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;
