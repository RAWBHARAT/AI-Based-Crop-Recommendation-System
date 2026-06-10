import { useState, useEffect } from "react";

function Fertilizer() {

  const [soil, setSoil] = useState(null);
  const [results, setResults] = useState([]);

  // ✅ 1. Load soil (latest)
  useEffect(() => {
    const fetchSoil = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/soil", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        const data = await res.json();

        if (data.length > 0) {
          setSoil(data[data.length - 1]);
        }

      } catch (error) {
        console.log(error);
      }
    };

    fetchSoil();
  }, []);

  // ✅ 2. Restore saved fertilizer (VERY IMPORTANT)
  useEffect(() => {
    const saved = localStorage.getItem("fertilizerData");

    if (saved) {
      setResults(JSON.parse(saved));
    }
  }, []);

  // ✅ 3. AUTO FETCH (NO BUTTON)
  useEffect(() => {

    const fetchFertilizer = async () => {

      const crops = JSON.parse(localStorage.getItem("recommendedCrops"));

      if (!soil || !crops) return;

      try {
        const res = await fetch("http://localhost:5000/api/fertilizer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            crops,
            nitrogen: Number(soil.nitrogen),
            phosphorus: Number(soil.phosphorus),
            potassium: Number(soil.potassium),
          }),
        });

        const data = await res.json();

        if (data?.result?.length > 0) {
          setResults(data.result);

          // 🔥 SAVE FOR ALL PAGES
          localStorage.setItem(
            "fertilizerData",
            JSON.stringify(data.result)
          );
        }

      } catch (error) {
        console.log(error);
      }
    };

    fetchFertilizer();

  }, [soil]);

  return (
    <div>

      <h1 className="text-2xl font-bold text-green-700">
        💊 Fertilizers
      </h1>

      {/* 🔥 LOADING */}
      {results.length === 0 && (
        <p className="mt-4 text-gray-500">
          ⏳ Generating fertilizer suggestions...
        </p>
      )}

      {/* ✅ RESULT */}
      {results.length > 0 && (
        <div className="mt-6 space-y-4">

          {results.map((item, i) => (
            <div key={i} className="bg-green-100 p-4 rounded-xl shadow">

              <h2 className="font-bold text-green-700">
                🌾 {item.crop} ({item.confidence}%)
              </h2>

              <div className="mt-2">
                {item.fertilizers.map((f, j) => (
                  <p key={j}>• {f}</p>
                ))}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Fertilizer;