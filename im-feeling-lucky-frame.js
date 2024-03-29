const express = require('express');
const axios = require('axios');
const app = express();

// Serve static files (HTML, CSS, JS, etc.)
app.use(express.static('.'));

// Endpoint to fetch a joke
app.get('/lucky', async (req, res) => {
    try {
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
        if (response.data && response.data.joke) {
            res.json({ message: response.data.joke });
        } else {
            res.json({ message: 'Feeling lucky? Try again!' });
        }
    } catch (error) {
        console.error('Error fetching joke:', error);
        res.status(500).json({ message: 'Error fetching joke, please try again later.' });
    }
});

// Listen on the specified port or 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
