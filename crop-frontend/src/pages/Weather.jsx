import { useState, useEffect } from "react";

function Weather() {

  const [weather, setWeather] = useState(null);

  // ✅ ICON FUNCTION
  const getWeatherIcon = (description) => {
    if (!description) return "🌍";   // 🔥 FIX

    description = description.toLowerCase();

    if (description.includes("clear")) return "☀️";
    if (description.includes("cloud")) return "☁️";
    if (description.includes("rain")) return "🌧";
    if (description.includes("storm")) return "⛈";
    if (description.includes("mist") || desc.includes("haze")) return "🌫";

    return "🌍";
  };

  const getWeatherText = (description) => {
    if (!description) return "Unknown";  // 🔥 FIX

    description = description.toLowerCase();

    if (description.includes("clear")) return "Sunny";
    if (description.includes("few clouds")) return "Mostly Sunny";
    if (description.includes("scattered")) return "Partly Cloudy";
    if (description.includes("broken")) return "Cloudy";
    if (description.includes("overcast")) return "Overcast";
    if (description.includes("rain")) return "Rainy";
    if (description.includes("haze")) return "Hazy";
    if (description.includes("mist")) return "Misty";
    if (description.includes("storm")) return "Stormy";

    return description;
  };
  useEffect(() => {

  const fetchWeather = async () => {
    try {
      const location = localStorage.getItem("location");

      console.log("Using location:", location); // DEBUG

      if (!location) {
        console.log("No location found ❌");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/weather?location=${encodeURIComponent(location)}`
      );

      const data = await res.json();

      console.log("WEATHER:", data);

      setWeather(data);

    } catch (error) {
      console.log("Fetch error:", error);
    }
  };

  fetchWeather();

}, []);

  // ✅ LOADING STATE
  if (!weather) {
    return <p className="text-gray-500 mt-4">Loading weather...</p>;
  }

  return (
    <div>

      <h1 className="text-2xl font-bold text-green-700">
        🌦 Weather
      </h1>

      <div className="bg-blue-100 p-6 rounded-xl mt-4 shadow">

        <h2 className="text-xl font-bold">
          📍 {weather.city}
        </h2>

        

        <p>🌡 Temperature: {weather.temperature}°C</p>
        
        <p>💧 Humidity: {weather.humidity}%</p>

        <p>
          {getWeatherIcon(weather?.weather)} Condition: {getWeatherText(weather?.weather)}
        </p>

        <p>💨 Wind: {weather.wind} m/s</p>
        <p>🌫 Pressure: {weather.pressure} hPa</p>
        <p>👁 Visibility: {weather.visibility} km</p>

        

      </div>

    </div>
  );
}

export default Weather;