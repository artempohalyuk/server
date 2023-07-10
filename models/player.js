const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  playerID: {
    type: Number,
    required: true,
    unique: true,
  },
  sportsDataID: String,
  status: String,
  teamID: Number,
  team: String,
  jersey: Number,
  positionCategory: String,
  position: String,
  firstName: String,
  lastName: String,
  birthDate: Date,
  birthCity: String,
  birthState: {
    type: String,
    required: true,
  },
  birthCountry: String,
  globalTeamID: Number,
  height: Number,
  weight: Number,
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;