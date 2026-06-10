const mongoose = require("mongoose");

const FarmSchema = new mongoose.Schema({
  userId: String,
  crop: String,
  season: String,
  yield: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Farm", FarmSchema);