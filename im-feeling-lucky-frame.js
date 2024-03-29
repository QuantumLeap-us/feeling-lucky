const express = require('express');
const axios = require('axios');
const app = express();

app.get('/lucky', async (req, res) => {
  try {
    // Fetch a random joke from JokeAPI
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
    if (response.data && response.data.joke) {
      // Send the joke as the response
      res.json({ message: response.data.joke });
    } else {
      // If no joke is found, send a default message
      res.json({ message: 'Feeling lucky? Try again!' });
    }
  } catch (error) {
    console.error('Error fetching joke:', error);
    res.status(500).json({ message: 'Error fetching joke, please try again later.' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
