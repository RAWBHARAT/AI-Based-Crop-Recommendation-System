import { useNavigate } from "react-router-dom";
import { useLang } from "../utils/useLang";

function Sidebar() {
  const t = useLang();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="w-64 bg-white shadow-lg p-5 flex flex-col justify-between">

      <div>
        <h1 className="text-2xl font-bold text-green-700 mb-6">
          🌱 AI Crop Recommendation
        </h1>

        <ul className="space-y-3">

          <li
            onClick={() => navigate("/dashboard")}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            📊 {t.dashboard}
          </li>

          <li
            onClick={() => navigate("/profile")}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            👤 {t.profile}
          </li>

          <li
            onClick={() => navigate("/soil")}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            🌾 {t.soil}
          </li>

          <li
            onClick={() => navigate("/recommend")}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            🌿 {t.recommendation}
          </li>

          <li
            onClick={() => navigate("/fertilizer")}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            💊 {t.fertilizer}
          </li>

          <li
            onClick={() => navigate("/pesticide")}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            🐛 {t.pesticide}
          </li>

          <li
            onClick={() => navigate("/weather")}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            🌦 {t.weather}
          </li>

          <li
            onClick={() => navigate("/mandi")}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            💰 {t.mandi}
          </li>

          <li
            onClick={() => navigate("/farm")}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            📜 {t.farm}
          </li>

          <li
            onClick={() => navigate("/learning")}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            🎓 {t.learning}
          </li>

          <li
            onClick={() => navigate("/settings")}
            className="p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            ⚙ {t.settings}
          </li>

        </ul>
      </div>

      <button
        onClick={logout}
        className="bg-gray-200 py-2 rounded-lg mt-4 hover:bg-gray-300"
      >
        🚪 Logout
      </button>

    </div>
  );
}

export default Sidebar;