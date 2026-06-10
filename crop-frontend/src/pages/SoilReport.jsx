import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SoilReport() {

  const navigate = useNavigate();

  const [soilForm, setSoilForm] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    rainfall: "",
    temperature: "",
    humidity: "",
  });

  const [soilData, setSoilData] = useState([]);

  const handleSoilChange = (e) => {
    setSoilForm({ ...soilForm, [e.target.name]: e.target.value });
  };

  // ✅ SAVE SOIL + AUTO FLOW
  const saveSoil = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/soil", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(soilForm),
      });

      const data = await res.json();

      // 🔥 SAVE SOIL GLOBALLY
      localStorage.setItem("soilData", JSON.stringify(soilForm));

      // 🔥 CLEAR OLD DATA (VERY IMPORTANT)
      localStorage.removeItem("recommendedCrops");
      localStorage.removeItem("fertilizerData");
      localStorage.removeItem("pesticideData");

      alert("Soil Data Saved ✅");

      // 🔥 REDIRECT TO AUTO AI
      navigate("/recommendation");

    } catch (error) {
      console.log(error);
    }
  };

  // ✅ FETCH PREVIOUS DATA
  const fetchSoil = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/soil", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();
      setSoilData(data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSoil();
  }, []);

  return (
    <div>

      <h1 className="text-3xl font-bold text-green-700 mb-6">
        🌾 Soil Report
      </h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="text-xl font-bold mb-4">Soil Input</h2>

        <div className="grid grid-cols-2 gap-4">

          <input name="nitrogen" placeholder="Nitrogen" onChange={handleSoilChange} className="border p-2 rounded" />
          <input name="phosphorus" placeholder="Phosphorus" onChange={handleSoilChange} className="border p-2 rounded" />
          <input name="potassium" placeholder="Potassium" onChange={handleSoilChange} className="border p-2 rounded" />
          <input name="ph" placeholder="pH Value" onChange={handleSoilChange} className="border p-2 rounded" />

          <input name="rainfall" placeholder="Rainfall (mm)" onChange={handleSoilChange} className="border p-2 rounded" />
          <input name="temperature" placeholder="Temperature (°C)" onChange={handleSoilChange} className="border p-2 rounded" />
          <input name="humidity" placeholder="Humidity (%)" onChange={handleSoilChange} className="border p-2 rounded" />

        </div>

        <button
          onClick={saveSoil}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Save Soil Data
        </button>

      </div>

      {/* DATA */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">📊 Soil Reports</h2>

        {soilData.length === 0 && (
          <p className="text-gray-500">No soil data yet</p>
        )}

        {soilData.map((item, i) => (
          <div key={i} className="border p-3 rounded mb-2">

            <p>N: {item.nitrogen}</p>
            <p>P: {item.phosphorus}</p>
            <p>K: {item.potassium}</p>
            <p>pH: {item.ph}</p>
            <p>Rainfall: {item.rainfall} mm</p>
            <p>Temperature: {item.temperature} °C</p>
            <p>Humidity: {item.humidity} %</p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default SoilReport;