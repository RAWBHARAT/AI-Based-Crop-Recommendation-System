require("dotenv").config();
console.log("API KEY:", process.env.GEMINI_API_KEY);
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Farm = require("./models/Farm");
const agriData = require("./data/agriData");
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));



const app = express();

app.use(cors({
  origin: "*",
}));

app.use(express.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error:", err));


// Farmer Schema
const User = mongoose.model("User", {
  name: String,
  username: String,
  email: String,
  password: String,
  state: String,
  district: String,
  village: String,
  water: String,
  land: String,
  phone: String,
  location: String
});

const Soil = mongoose.model("Soil", {
  userId: String,
  nitrogen: String,
  phosphorus: String,
  potassium: String,
  ph: String,
  soilType: String,
  rainfall: String,
  temperature: String,
  humidity: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});




const JWT_SECRET = "secretkey";




// ================= REGISTER =================

app.post("/api/register", async (req, res) => {

  try {

    const {
      name,
      username,
      email,
      password,
      state,
      district,
      village,
      water,
      land,
      phone,
      location
    } = req.body;


    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      state,
      district,
      village,
      water,
      land,
      phone,
      location
    });


    res.json({
      message: "Farmer Registered Successfully ✅",
      name: newUser.name
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Registration Failed" });

  }

});


// ================= LOGIN =================

app.post("/api/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      name: user.name,
      email: user.email,
      location: user.district,
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Login Failed" });

  }

});

// 🔐 GET PROFILE
app.get("/api/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, "secretkey");

    const user = await User.findById(decoded.id).select("-password");

    res.json(user);

  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
});

// 🤖 GEMINI AI SETUP


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("User message:", message);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",   // ✅ updated
    });

    const result = await model.generateContent(
      `You are an agriculture expert. Answer simply. Question: ${message}`
    );


    const text = result.response.text();

    res.json({ reply: text });

  } catch (error) {
    console.log("REAL ERROR:", error);   // 🔥 IMPORTANT
    res.status(500).json({ reply: "Error from AI ❌" });
  }
});

app.post("/api/soil", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    // ✅ CHECK TOKEN
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, "secretkey");
    } catch (err) {
      return res.status(401).json({ message: "Token expired" });
    }

    // ✅ SAVE DATA
    const newSoil = await Soil.create({
      userId: decoded.id,
      ...req.body,
    });

    res.json({ message: "Soil saved ✅", data: newSoil });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error saving soil" });
  }
});


app.get("/api/soil", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, "secretkey");
    } catch (err) {
      return res.status(401).json({ message: "Token expired" });
    }

    const soilData = await Soil.find({ userId: decoded.id });

    res.json(soilData);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching soil" });
  }
});






app.get("/api/weather", async (req, res) => {
  try {
    const API_KEY = process.env.WEATHER_API_KEY;

    const location = req.query.location;

    if (!location) {
      return res.status(400).json({ message: "Location missing ❌" });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location},IN&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.main) {
      return res.status(400).json({ message: "Invalid city ❌" });
    }

    res.json({
      city: data.name,
      temperature: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      weather: data.weather[0].description,
      icon: data.weather[0].icon,
      wind: data.wind.speed,
      visibility: data.visibility / 1000,
      updatedAt: new Date(data.dt * 1000).toLocaleTimeString(),
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Weather error ❌" });
  }
});
// 💰 MANDI PRICES
app.get("/api/mandi", async (req, res) => {
  try {
    const API_KEY = process.env.MANDI_API_KEY;

    const location = req.query.location || "Indore";

    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&filters[district]=${location}&limit=50`;

    const response = await fetch(url);
    const data = await response.json();

    const result = data.records
      ?.filter(item => item.modal_price)
      .map(item => ({
        crop: item.commodity,
        market: item.market,
        district: item.district,
        price: Number(item.modal_price),
      })) || [];

    result.sort((a, b) => b.price - a.price);

    res.json({ result });

  } catch (error) {
    console.log(error);
    res.json({ result: [] });
  }
});



// ===============================
// 📜 FARM HISTORY API
// ===============================

let farmHistory = [];

app.post("/api/farm-history", (req, res) => {
  try {
    const record = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toLocaleString(),
    };

    farmHistory.push(record);

    console.log("Saved History:", record);

    res.json({ message: "Saved ✅", record });

  } catch (err) {
    res.status(500).json({ message: "Error saving ❌" });
  }
});

app.get("/api/farm-history", (req, res) => {
  res.json({ history: farmHistory });
});




// 🎓 LEARNING PROGRAM
app.get("/api/learning", async (req, res) => {
  try {

    const data = [
      {
        title: "How to Grow Wheat",
        category: "Crop",
        content: "Use well-drained soil and moderate irrigation.",
        video: "https://www.youtube.com/embed/2V7wJ1v5d7A"
      },
      {
        title: "Soil Health Management",
        category: "Soil",
        content: "Maintain proper pH and organic matter.",
        video: "https://www.youtube.com/embed/l1E9z9wWbQw"
      },
      {
        title: "Irrigation Techniques",
        category: "Water",
        content: "Drip irrigation saves water.",
        video: "https://www.youtube.com/embed/3V3Zz6k1w"
      },
      {
        title: "Pest Control Basics",
        category: "Pest",
        content: "Use neem-based pesticides.",
        video: "https://www.youtube.com/embed/fQ5y8g"
      }
    ];

    res.json(data);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Learning data error" });
  }
});

// ================= ML RECOMMENDATION =================

app.post("/api/recommend", async (req, res) => {
  try {
    console.log("RECOMMEND HIT ✅");

    const response = await fetch("http://127.0.0.1:5001/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        N: parseFloat(req.body.nitrogen),
        P: parseFloat(req.body.phosphorus),
        K: parseFloat(req.body.potassium),
        temperature: parseFloat(req.body.temperature || 25),
        humidity: parseFloat(req.body.humidity || 60),
        ph: parseFloat(req.body.ph),
        rainfall: parseFloat(req.body.rainfall || 100),
      }),
    });

    const data = await response.json();

    console.log("ML Response:", data);
    console.log("TYPE:", typeof data);
    console.log("RECOMMENDATIONS:", data.recommendations);

    res.json({
      recommendations: data.recommendations
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Error ❌" });
  }
});





app.post("/api/fertilizer", (req, res) => {
  try {
    console.log("FERTILIZER HIT ✅");

    const { crops, nitrogen, phosphorus, potassium } = req.body;

    let result = [];

    crops.forEach((item) => {

      const cropName = item.crop.toLowerCase();
      const data = agriData[cropName];

      if (!data) {
        console.log("❌ No data for:", cropName);
        return;
      }

      let fertilizers = [...data.fertilizers];

      // 🔥 Soil logic
      if (nitrogen < 50) fertilizers.push("Urea (Boost)");
      if (phosphorus < 50) fertilizers.push("DAP (Boost)");
      if (potassium < 50) fertilizers.push("MOP (Boost)");

      result.push({
        crop: item.crop,
        confidence: item.confidence,
        fertilizers,
      });

    });

    res.json({ result });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error ❌" });
  }
});


app.post("/api/pesticide", (req, res) => {
  try {
    const { crops } = req.body;

    let result = [];

    crops.forEach((item) => {

      const cropName = item.crop.toLowerCase();
      const data = agriData[cropName];

      if (!data) return;

      result.push({
        crop: item.crop,
        confidence: item.confidence,
        pesticides: data.pesticides
      });

    });

    res.json({ result });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error ❌" });
  }
});


// ================= SERVER =================

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});