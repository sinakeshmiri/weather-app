const http = require('http');
const url = require('url');
const { MongoClient } = require('mongodb');
const axios = require('axios');

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection URI
const dbName = 'weather_db'; // Replace with your database name
const collectionName = 'weather_collection'; // Replace with your collection name

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const getData = async (cityName) => {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
    try {
        const response = await axios.get(apiUrl, {
            params: {
                q: cityName,
                appid: '3679755b1ebb6cd9b2cd32048242a186', // Replace with your OpenWeather API key
                units: 'metric'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    console.log(req.url);

    if (req.method === 'POST') {
        let requestBody = '';

        req.on('data', (chunk) => {
            requestBody += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const requestData = JSON.parse(requestBody);

                if (req.url === '/admin') {
                    if (requestData.user === 'admin' && requestData.pass === 'admin') {
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                    } else {
                        throw new Error('Invalid credentials');
                    }
                } else {
                    throw new Error('Unknown endpoint');
                }
            } catch (error) {
                console.error('Error processing POST request:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON data' }));
            }
        });
    } else if (req.method === 'GET') {
        const parsedUrl = url.parse(req.url, true);
        const cityName = parsedUrl.query.q;

        if (cityName) {
            try {
                await client.connect();

                const db = client.db(dbName);
                const collection = db.collection(collectionName);

                const query = { name: cityName };

                const result = await collection.findOne(query);

                if (result) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                } else {
                    console.log('City data not found in the database');

                    const weatherData = await getData(cityName);

                    if (weatherData.cod === 200) {
                        const insertResult = await collection.insertOne(weatherData);
                        console.log('Data inserted:', insertResult.insertedCount);

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(weatherData));
                    } else {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'City not found' }));
                    }
                }
            } catch (error) {
                console.error('Error processing GET request:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Something went wrong' }));
            } finally {
                client.close();
            }
        } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing city name in the query parameters' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

const port = 3000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
