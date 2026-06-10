import { useState, useEffect } from "react";

function Settings() {

  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setLanguage(saved);
  }, []);

  const changeLanguage = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("lang", lang);

    // 🔥 Reload to apply everywhere
    window.location.reload();
  };

  return (
    <div>

      <h1 className="text-3xl font-bold text-green-700 mb-6">
        ⚙ Settings
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">
          🌍 Language
        </h2>

        <select
          value={language}
          onChange={changeLanguage}
          className="border p-2 rounded w-full"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>

      </div>

    </div>
  );
}

export default Settings;