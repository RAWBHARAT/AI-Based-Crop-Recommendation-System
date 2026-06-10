import { useState, useEffect } from "react";

function Mandi() {

  const [allData, setAllData] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [nearestMandis, setNearestMandis] = useState([]);

  useEffect(() => {

    const fetchMandi = async () => {
      try {
        const location = localStorage.getItem("location");

        console.log("LOCATION:", location);

        if (!location) return;

        const res = await fetch(
          `https://ai-based-crop-recommendation-system-avp5.onrender.com/api/mandi?location=${encodeURIComponent(location)}`
        );

        const data = await res.json();
        const mandiData = data.result || [];

        setAllData(mandiData);

        // ===============================
        // ⭐ RECOMMENDED CROPS (FIXED)
        // ===============================
        const crops = JSON.parse(localStorage.getItem("recommendedCrops")) || [];

        const recommendedData = crops
          .map(cropItem => {
            const match = mandiData.find(item =>
              item.crop?.toLowerCase() === cropItem.crop?.toLowerCase()
            );

            if (!match) return null;

            return {
              crop: cropItem.crop,
              confidence: cropItem.confidence,
              market: match.market,
              district: match.district,
              price: match.price,
            };
          })
          .filter(Boolean);

        setRecommended(recommendedData);

        // ======================================
        // 📍 NEAREST MANDIS (ONLY RECOMMENDED)
        // ======================================
        const marketMap = {};

        recommendedData.forEach(item => {
          if (!marketMap[item.market]) {
            marketMap[item.market] = [];
          }
          marketMap[item.market].push(item);
        });

        const nearest = Object.keys(marketMap)
          .slice(0, 4)
          .map(market => ({
            market,
            crops: marketMap[market]
          }));

        setNearestMandis(nearest);

      } catch (error) {
        console.log("MANDI ERROR:", error);
      }
    };

    fetchMandi();

  }, []);

  return (
    <div>

      <h1 className="text-2xl font-bold text-green-700">
        🏪 Mandi Prices
      </h1>

      {/* ========================= */}
      {/* ⭐ RECOMMENDED CROPS */}
      {/* ========================= */}
      <h2 className="mt-6 text-xl font-bold text-blue-700">
        ⭐ Recommended Crop Prices
      </h2>

      {recommended.length === 0 ? (
        <p className="text-gray-500 mt-2">No matching mandi data</p>
      ) : (
        recommended.map((item, i) => (
          <div key={i} className="bg-green-100 p-4 mt-3 rounded-xl shadow">

            <h2 className="font-bold text-lg">
              🌾 {item.crop} ({item.confidence}%)
            </h2>

            <p>📍 {item.market}, {item.district}</p>

            <p className="text-green-700 font-semibold">
              💰 ₹{item.price} / quintal
            </p>

          </div>
        ))
      )}

      {/* ========================= */}
      {/* 📍 NEAREST MANDIS */}
      {/* ========================= */}
      <h2 className="mt-8 text-xl font-bold text-purple-700">
        📍 Nearest Mandis (Recommended Crops)
      </h2>

      {nearestMandis.length === 0 ? (
        <p className="text-gray-500 mt-2">No nearby mandi found</p>
      ) : (
        nearestMandis.map((marketData, i) => (
          <div key={i} className="bg-purple-100 p-4 mt-3 rounded-xl shadow">

            <h2 className="font-bold text-lg">
              🏪 {marketData.market}
            </h2>

            {marketData.crops.map((crop, j) => (
              <p key={j}>
                🌾 {crop.crop} → 💰 ₹{crop.price}
              </p>
            ))}

          </div>
        ))
      )}

      {/* ========================= */}
      {/* 📊 ALL MANDI DATA */}
      {/* ========================= */}
      <h2 className="mt-8 text-xl font-bold text-yellow-700">
        📊 All Mandi Prices
      </h2>

      {allData.length === 0 ? (
        <p className="text-gray-500 mt-2">No mandi data available</p>
      ) : (
        allData.map((item, i) => (
          <div key={i} className="bg-yellow-100 p-4 mt-3 rounded-xl shadow">

            <h2 className="font-bold text-lg">
              🌾 {item.crop}
            </h2>

            <p>📍 {item.market}, {item.district}</p>

            <p className="text-green-700 font-semibold">
              💰 ₹{item.price} / quintal
            </p>

          </div>
        ))
      )}

    </div>
  );
}

export default Mandi;