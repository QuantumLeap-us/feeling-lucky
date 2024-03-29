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
    console.log("Incoming request to /api/lucky");

    try {
        console.log("Fetching joke from JokeAPI");
        const jokeApiResponse = await axios.get('https://v2.jokeapi.dev/joke/Any', {
            params: {
                blacklistFlags: 'racist',
            }
        });

        console.log("JokeAPI response:", jokeApiResponse.data);

        if (jokeApiResponse.data.type === 'single') {
            console.log("Responding with single joke");
            res.json({ message: jokeApiResponse.data.joke });
        } else if (jokeApiResponse.data.type === 'twopart') {
            console.log("Responding with two-part joke");
            res.json({ message: `${jokeApiResponse.data.setup} ... ${jokeApiResponse.data.delivery}` });
        } else {
            console.log("No joke found in response");
            res.json({ message: 'No joke found, try again!' });
        }
    } catch (error) {
        console.error('Error fetching joke from JokeAPI:', error);
        res.status(500).json({ message: 'Failed to fetch joke, please try again later.' });
    }
};