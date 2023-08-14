const axios = require("axios");
const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://mongo:27017'; // Replace with your MongoDB connection URI
const dbName = 'weather_db'; // Replace with your database name
const collectionName = 'weather_collection'; // Replace with your collection name

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
function areDatesEqual(dateString) {
    const currentDate = new Date();
    const inputDate = new Date(dateString);
  
    // Compare year, month, and day of both dates
    return (
      currentDate.getFullYear() === inputDate.getFullYear() &&
      currentDate.getMonth() === inputDate.getMonth() &&
      currentDate.getDate() === inputDate.getDate()
    );
  }
  
const getData = async (cityName) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather`;
    try {
        const response = await axios.get(apiUrl, {
            params: {
                q: cityName,
                appid: '3679755b1ebb6cd9b2cd32048242a186',
                units: 'metric'
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Create an HTTP server
const server = http.createServer(async (req, res) => {
    // Parse the URL and query parameters
    const parsedUrl = url.parse(req.url, true);
    let cityName = parsedUrl.query.q;

    try {
        await client.connect();

        // Check if the data is in the database
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        cityName = cityName[0].toUpperCase() + cityName.slice(1)
        //console.log(cityName)
        const query = { name: cityName };

        const result = await collection.findOne(query);
        
        console.log(result);
        if (result && areDatesEqual(result.timestamp)) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));  
        }else {
            await collection.deleteOne(query);

            // Get weather data using the cityName
            const weatherData = await getData(cityName);
            if (weatherData.cod == '200') {
                // Insert data into the database
                weatherData.timestamp = new Date();
                const result = await collection.insertOne(weatherData);
                console.log('Data inserted:', result.insertedCount);

                // Respond with weather data
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(weatherData));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ "error": "city not found" }));
            }
        }
    } catch (error) {
        // console.log(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ "error": "something went wrong" }));
    } finally {
        await client.close();
    }
});

// Define the server port
const port = 3000; // You can change this to any port you prefer

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
