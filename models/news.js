const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  newsID: {
    type: Number,
    required: true,
    unique: true,
  },
  source: String,
  updated: Date,
  timeAgo: String,
  title: String,
  content: String,
  url: String,
  termsOfUse: String,
  author: String,
  categories: String,
  playerID: Number,
  teamID: Number,
  team: String,
  playerID2: Number,
  teamID2: Number,
  team2: String,
  originalSource: String,
  originalSourceUrl: String,
});

newsSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

const News = mongoose.model('News', newsSchema);

module.exports = News;