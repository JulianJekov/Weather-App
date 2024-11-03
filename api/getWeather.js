const axios = require('axios');

module.exports = async (req, res) => {
    const { city, endPoint } = req.query;
    const apiKey = process.env.API_KEY;
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/${endPoint}`, {
            params: {
                q: city,
                appid: apiKey,
                units: 'metric',
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
};