import React, { useState } from "react";

export default function WeatherNow() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1`
      );
      if (!geoRes.ok) throw new Error("Failed to fetch location");
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0)
        throw new Error("City not found");

      const { latitude, longitude, name, country } = geoData.results[0];
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      if (!weatherRes.ok) throw new Error("Failed to fetch weather");
      const weatherData = await weatherRes.json();

      setWeather({ ...weatherData.current_weather, name, country });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Weather Now</h1>

      <div className="flex w-full max-w-md mb-6">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l-lg focus:outline-none"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getWeather()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
          onClick={getWeather}
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {weather && (
        <div className="bg-white shadow-lg rounded-xl p-6 text-center w-80">
          <h2 className="text-xl font-semibold text-gray-800">
            {weather.name}, {weather.country}
          </h2>
          <p className="text-5xl font-bold text-blue-600 my-4">
            {weather.temperature}°C
          </p>
          <p className="text-gray-700">Windspeed: {weather.windspeed} km/h</p>
          <p className="text-gray-700">Direction: {weather.winddirection}°</p>
        </div>
      )}
    </div>
  );
}
