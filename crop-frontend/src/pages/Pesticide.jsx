import { useState, useEffect } from "react";

function Pesticide() {

  const [results, setResults] = useState([]);

  // ✅ 1. Restore saved pesticide data
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pesticideData");

      if (saved) {
        setResults(JSON.parse(saved));
      }
    } catch (error) {
      console.log("Parse Error:", error);
    }
  }, []);

  // ✅ 2. AUTO FETCH (NO BUTTON)
  useEffect(() => {

    const fetchPesticide = async () => {

      try {
        const crops = JSON.parse(localStorage.getItem("recommendedCrops"));

        if (!crops || crops.length === 0) {
          console.log("No crops found ❌");
          return;
        }

        const res = await fetch("https://ai-based-crop-recommendation-system-avp5.onrender.com/api/pesticide", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ crops }),
        });

        const data = await res.json();

        console.log("PESTICIDE RESPONSE:", data);

        if (data?.result?.length > 0) {
          setResults(data.result);

          // 🔥 SAVE FOR ALL PAGES
          localStorage.setItem(
            "pesticideData",
            JSON.stringify(data.result)
          );
        }

      } catch (error) {
        console.log("Fetch Error:", error);
      }
    };

    fetchPesticide();

  }, []);

  return (
    <div>

      <h1 className="text-2xl font-bold text-green-700">
        🐛 Pesticides
      </h1>

      {/* 🔥 LOADING */}
      {results.length === 0 && (
        <p className="mt-4 text-gray-500">
          ⏳ Generating pesticide suggestions...
        </p>
      )}

      {/* ✅ RESULTS */}
      {results.length > 0 && (
        <div className="mt-6 space-y-4">

          {results.map((item, i) => (
            <div key={i} className="bg-yellow-100 p-4 rounded-xl shadow">

              <h2 className="font-bold text-yellow-700">
                🌾 {item.crop} ({item.confidence}%)
              </h2>

              <div className="mt-2">
                {item.pesticides?.map((p, j) => (
                  <p key={j}>• {p}</p>
                ))}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Pesticide;