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
    // Check if the request is for fetching a joke
    if (req.url === '/api/lucky') {
        if (req.method === 'GET') {
            console.log('GET request received for /api/lucky (this is expected for initial loading)'); 
            // Existing logic to fetch from Joke API and send the joke as JSON 
            fetchJoke(res); 
        } else if (req.method === 'POST') {
            console.log('POST request received for /api/lucky (this is expected when the button is clicked)'); 
            // Handle the POST request from Warpcast frame button
            fetchJoke((joke) => { 
                const newFrame = constructNewFrame(joke);
                res.status(200).send(newFrame); 
            });
        } else {
            res.status(405).send({ message: 'Method Not Allowed' });
        }
    } else {
        // Handle other routes as needed
        res.status(404).send({ message: 'Not Found' });
    }
};

function fetchJoke(res) {
    console.log("Fetching joke from JokeAPI");
    axios.get('https://v2.jokeapi.dev/joke/Any', {
        params: {
            blacklistFlags: 'racist',
        }
    }).then(jokeApiResponse => {
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
    }).catch(error => {
        console.error('Error fetching joke from JokeAPI:', error);
        res.status(500).json({ message: 'Failed to fetch joke, please try again later.' });
    });
}

function constructNewFrame(jokeData) {
    let jokeContent;
    if (jokeData.type === 'single') {
        jokeContent = jokeData.joke;
    } else if (jokeData.type === 'twopart') {
        jokeContent = `${jokeData.setup} ... ${jokeData.delivery}`;
    } else {
        jokeContent = 'No joke found, try again!';
    }

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>I'm Feeling Lucky Joke</title>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="https://feeling-lucky.vercel.app/background.png" /> 
            <meta property="og:image" content="https://feeling-lucky.vercel.app/background.png" />
        </head>
        <body>
            <p>${jokeContent}</p> 
        </body>
        </html>
    `;
}
