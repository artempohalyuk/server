const mongoose = require('mongoose');

const userTeamSchema = new mongoose.Schema({
  name: String,
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }]
});

userTeamSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const UserTeam = mongoose.model('UserTeam', userTeamSchema);

module.exports = UserTeam;