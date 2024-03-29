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

const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // Fetching a joke from the JokeAPI
        const jokeApiResponse = await axios.get('https://v2.jokeapi.dev/joke/Any', {
            params: {
                blacklistFlags: 'racist',
                // Remove the 'type' parameter to fetch both single and two-part jokes
            }
        });

        // Check the structure of the joke and respond accordingly
        let jokeMessage;
        if (jokeApiResponse.data.type === 'single') {
            jokeMessage = jokeApiResponse.data.joke; // For single-part jokes
        } else if (jokeApiResponse.data.type === 'twopart') {
            jokeMessage = `${jokeApiResponse.data.setup} ... ${jokeApiResponse.data.delivery}`; // For two-part jokes
        } else {
            jokeMessage = 'No joke found, try again!'; // Default message
        }

        // Respond with the joke
        res.json({ joke: jokeMessage });
    } catch (error) {
        console.error('Error fetching joke:', error);
        res.status(500).json({
            message: 'Failed to fetch joke, please try again later.',
            error: error.message
        });
    }
};
