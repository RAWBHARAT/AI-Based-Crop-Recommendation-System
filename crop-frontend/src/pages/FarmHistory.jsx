import { useEffect, useState } from "react";

function FarmHistory() {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch("https://ai-based-crop-recommendation-system-avp5.onrender.com/api/farm-history");
      const data = await res.json();
      setHistory(data.history);
    };

    fetchHistory();
  }, []);

  return (
    <div>

      <h1 className="text-2xl font-bold text-green-700">
        📜 Farm History
      </h1>

      {history.length === 0 ? (
        <p>No history yet</p>
      ) : (
        history.map((item, i) => (
          <div key={i} className="bg-green-100 p-4 mt-3 rounded-xl">

            <p>📅 {item.createdAt}</p>

            <p>🌾 Recommended:</p>
            {item.recommendations.map((r, j) => (
              <p key={j}>- {r.crop} ({r.confidence}%)</p>
            ))}

            <p>✅ Selected: {item.selectedCrop || "Not selected"}</p>

          </div>
        ))
      )}

    </div>
  );
}

export default FarmHistory;