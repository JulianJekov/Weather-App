export default async function handler(req, res) {
    const { city } = req.query;
    const apiKey = process.env.API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            res.status(200).json(data);
        } else {
            res.status(data.cod).json({ message: data.message });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}