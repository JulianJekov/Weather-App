export default async function handler(req, res) {
    const { city, type } = req.query;
    const apiKey = process.env.API_KEY;
    
    if (!city || !type || !apiKey) {
      return res.status(400).json({ error: "City, type, and API key are required" });
    }
  
    const apiUrl = `https://api.openweathermap.org/data/2.5/${type}?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.cod !== 200) {
        return res.status(data.cod).json({ error: data.message });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  }