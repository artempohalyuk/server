const mongoose = require('mongoose');

// const teamSchema = new mongoose.Schema({
//   teamID: {
//     type: Number,
//     required: true,
//     unique: true,
//   },
//   key: String,
//   active: Boolean,
//   city: String,
//   name: String,
//   leagueID: Number,
//   stadiumID: Number,
//   conference: String,
//   division: String,
//   primaryColor: String,
//   secondaryColor: String,
//   tertiaryColor: String,
//   quaternaryColor: String,
//   wikipediaLogoUrl: String,
//   wikipediaWordMarkUrl: String,
//   globalTeamID: Number,
//   nbaDotComTeamID: Number,
//   headCoach: String,
// });

const userTeamSchema = new mongoose.Schema({
  teamId: {
    type: Number,
    unique: true,
  },
  name: String,
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }]
});

const UserTeam = mongoose.model('UserTeam', userTeamSchema);

module.exports = UserTeam;