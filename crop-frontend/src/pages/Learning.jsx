import { useEffect, useState } from "react";

function Learning() {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/learning");
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLearning();
  }, []);

  return (
    <div>

      <h1 className="text-3xl font-bold text-green-700 mb-6">
        🎓 Learning Program
      </h1>

      <div className="grid grid-cols-2 gap-6">

        {data.map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow">

            <h2 className="text-lg font-bold text-green-700">
              {item.title}
            </h2>

            <p className="text-sm text-gray-500 mb-2">
              Category: {item.category}
            </p>

            <p className="mb-3">
              {item.content}
            </p>

            <iframe
              width="100%"
              height="200"
              src={item.video}
              title="video"
              allowFullScreen
              className="rounded"
            ></iframe>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Learning;