const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.static('.'));

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

// Conditionally listen on the port only when not in Vercel's environment
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
