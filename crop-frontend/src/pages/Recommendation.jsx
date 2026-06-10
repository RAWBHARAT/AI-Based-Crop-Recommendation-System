import { useState, useEffect } from "react";

function Recommendation() {

  const [soil, setSoil] = useState(null);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ 1. Fetch soil
  useEffect(() => {
    const fetchSoil = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/soil", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        const data = await res.json();

        if (data.length > 0) {
          const latest = data[data.length - 1];
          setSoil(latest);

          localStorage.setItem("soilData", JSON.stringify(latest));
        }

      } catch (error) {
        console.log(error);
      }
    };

    fetchSoil();
  }, []);

  // ✅ 2. AUTO RUN ML + HISTORY SAVE
  useEffect(() => {

    if (!soil) return;

    const autoRecommend = async () => {

      const saved = localStorage.getItem("recommendedCrops");

      // ===============================
      // ✅ CASE 1: FROM LOCAL STORAGE
      // ===============================
      if (saved) {
        const parsed = JSON.parse(saved);
        setResult(parsed);

        // 🔥 SAVE HISTORY (from cache)
        try {
          const res = await fetch("https://ai-based-crop-recommendation-system-avp5.onrender.com/api/farm-history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              soil,
              recommendations: parsed,
            }),
          });

          const data = await res.json();
          console.log("Saved from cache:", data);

        } catch (err) {
          console.log("History save error:", err);
        }

        return;
      }

      // ===============================
      // ✅ CASE 2: RUN ML
      // ===============================
      setLoading(true);

      try {
        const res = await fetch("http://127.0.0.1:5000/api/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            nitrogen: Number(soil.nitrogen),
            phosphorus: Number(soil.phosphorus),
            potassium: Number(soil.potassium),
            temperature: Number(soil.temperature || 25),
            humidity: Number(soil.humidity || 60),
            ph: Number(soil.ph),
            rainfall: Number(soil.rainfall || 100),
          }),
        });

        const data = await res.json();

        console.log("AUTO RESPONSE:", data);

        if (data?.recommendations?.length > 0) {

          setResult(data.recommendations);

          // 🔥 SAVE FOR ALL PAGES
          localStorage.setItem(
            "recommendedCrops",
            JSON.stringify(data.recommendations)
          );

          // 🔥 SAVE HISTORY (ML result)
          const saveRes = await fetch("https://ai-based-crop-recommendation-system-avp5.onrender.com/api/farm-history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              soil,
              recommendations: data.recommendations,
            }),
          });

          const saveData = await saveRes.json();
          console.log("Saved from ML:", saveData);

        } else {
          alert("No prediction ❌");
        }

      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

    autoRecommend();

  }, [soil]);

  return (
    <div>

      <h1 className="text-2xl font-bold text-green-700">
        🌿 Recommendation
      </h1>

      {/* 🔄 LOADING */}
      {loading && <p className="mt-4">⏳ Predicting best crops...</p>}

      {/* ✅ RESULT */}
      {result.length > 0 && (
        <div className="mt-6 space-y-3">

          {result.map((item, i) => (
            <div key={i} className="bg-green-100 p-4 rounded-xl shadow">

              <h2 className="text-lg font-bold text-green-700">
                🌾 {item.crop}
              </h2>

              <p className="text-gray-600">
                Confidence: {item.confidence}%
              </p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Recommendation;