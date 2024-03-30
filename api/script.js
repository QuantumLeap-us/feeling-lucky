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

// script.js
const axios = require('axios');

module.exports = async (req, res) => {
    // Check if the request is a POST request to the expected endpoint
    if (req.method === 'POST' && req.url === '/api/lucky') {
        try {
            // Fetch a random joke from the JokeAPI
            const response = await axios.get('https://v2.jokeapi.dev/joke/Any', {
                params: {
                    blacklistFlags: 'racist',  // Specify any additional parameters as needed
                }
            });

            // Respond with the joke data based on the joke type
            if (response.data.type === 'single') {
                res.json({ joke: response.data.joke });
            } else if (response.data.type === 'twopart') {
                res.json({ setup: response.data.setup, delivery: response.data.delivery });
            } else {
                res.status(404).json({ message: 'Joke not found' });
            }
        } catch (error) {
            console.error('Error fetching joke:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Respond with a method not allowed error if the request does not match
        res.status(405).send('Method Not Allowed');
    }
};
