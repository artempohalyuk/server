const Player = require('../models/player');
const UserTeam = require('../models/user-team');
const News = require('../models/news');
const User = require('../models/user');

const getCurrentUser = (req, res) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        return res.formatError(404, 'User not found');
      }

      res.formatResponse(200, 'Success', user.toJSON());
  }).catch(() => res.formatError(500, 'Internal server error'));
}

const getUserTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const existingTeam = await UserTeam.findById(user.teamId).populate('players');

    res.formatResponse(200, 'Success', existingTeam.toJSON());
  } catch (error) {
    res.formatError(500, 'Internal server error');
  }
};

const createUserTeam = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.formatError(400, 'Team Name is required.');
    }

    const user = await User.findById(req.userId);

    if (user.teamId) {
      return res.formatError(400, 'You already have a team');
    }

    const newTeam = new UserTeam({ name: name, players: [] });
    const savedTeam = await newTeam.save();
    await User.findByIdAndUpdate(req.userId, { teamId: savedTeam._id });

    res.formatResponse(200, 'Success', savedTeam);
  } catch (error) {
    res.formatError(500, 'Internal server error');
  }
};

const updateUserTeam = async (req, res) => {
  try {
    const { playerIds } = req.body;
    const user = await User.findById(req.userId);
    const userTeam = await UserTeam.findById(user.teamId);
    userTeam.players = [...playerIds];
    const updatedTeam = await UserTeam.findByIdAndUpdate(user.teamId, userTeam, { new: true }).populate('players');

    res.formatResponse(200, 'Success', updatedTeam);
  } catch (error) {
    console.log(error);
    res.formatError(500, 'Internal server error');
  }
};

const getActivePlayers = async (req, res) => {
  try {
    const players = await Player.find();
    const transformedPlayers = players.map(player => player.toJSON());

    res.formatResponse(200, 'Success', transformedPlayers);
  } catch (error) {
    console.log(error);
    res.formatError(500, 'Internal server error', error);
  }
};

const getActiveTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    const transformedTeams = teams.map(team => team.toJSON());

    res.formatResponse(200, 'Success', transformedTeams);
  } catch (error) {
    res.formatError(500, 'Internal server error');
  }
};

const getLastNews = async (req, res) => {
  try {
    const newsList = await News.find();
    const transformedNews = newsList.map(news => news.toJSON());

    res.formatResponse(200, 'Success', transformedNews);
  } catch (error) {
    res.formatError(500, 'Internal server error');
  }
};

const getNewsDetails = async (req, res) => {
  try {
    const newsDetails = await News.findOne({newsID: req.params.id});

    res.formatResponse(200, 'Success', newsDetails);
  } catch (error) {
    res.formatError(500, 'Internal server error');
  }
};

module.exports = { 
  getCurrentUser,
  getActivePlayers, 
  getActiveTeams,
  getLastNews,
  getUserTeam,
  createUserTeam,
  getNewsDetails,
  removeUserTeam,
  updateUserTeam
};