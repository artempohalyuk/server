// const axios = require('axios');
// const API_KEY = 'db3af1795c014ba18534f61f7dd81f1e';
// const API_URL = 'https://api.sportsdata.io/v3/nba/scores/json/';
const Player = require('../models/player');
const UserTeam = require('../models/user-team');
const News = require('../models/news');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');

const getCurrentUser = (req, res) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        return res.formatError(404, 'User not found');
      }

      const currentUser = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        teamId: user.teamId
      };

      res.formatResponse(200, 'Success', currentUser);
  }).catch(() => res.formatError(500, 'Internal server error'));
}

const getUserTeam = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const existingTeam = await UserTeam.findOne({ teamId: user.teamId });

    res.formatResponse(200, 'Success', existingTeam);
  } catch (error) {
    res.formatError(500, 'Internal server error');
  }
};

const createUserTeam = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.userId);

    if (user.teamId) {
      return res.formatError(400, 'You already have a team');
    }

    const existingTeam = await UserTeam.findOne({ name: name });
  
    if (existingTeam) {
      return res.formatError(400, 'A team with this name already exists');
    }

    const newTeam = new UserTeam({ name: name, players: [] });
    await newTeam.save();
    console.log('1', newTeam);
    user.teamId = newTeam._id;
    await user.save();

    res.formatResponse(200, 'Success', {newTeam});
  } catch (error) {
    console.log('2', error);
    res.formatError(500, 'Internal server error');
  }
};

const removeUserTeam = async (req, res) => {
  try {
    const { teamName } = req.body;

    const user = await User.findById(req.userId);
    if (user.teamId) {
      return res.formatError(400, 'You already have a team');
    }

    const existingTeam = await Team.findOne({ name: teamName });
  
    if (existingTeam) {
      return res.formatError(400, 'A team with this name already exists');
    }

    const newTeam = new Team({ name: teamName, players });
    await newTeam.save();
    user.teamId = newTeam._id;
    await user.save();

    res.formatResponse(200, 'Success', {newTeam});
  } catch (error) {
    res.formatError(500, 'Internal server error');
  }
};

const updateUserTeam = async (req, res) => {
  try {
    const { teamName } = req.body;

    const user = await User.findById(req.userId);
    if (user.teamId) {
      return res.formatError(400, 'You already have a team');
    }

    const existingTeam = await Team.findOne({ name: teamName });
  
    if (existingTeam) {
      return res.formatError(400, 'A team with this name already exists');
    }

    const newTeam = new Team({ name: teamName, players });
    await newTeam.save();
    user.teamId = newTeam._id;
    await user.save();

    res.formatResponse(200, 'Success', {newTeam});
  } catch (error) {
    res.formatError(500, 'Internal server error');
  }
};

const getActivePlayers = async (req, res) => {
  try {
    const players = await Player.find({}, { _id: 0, __v: 0 });
    res.formatResponse(200, 'Success', players);
  } catch (error) {
    res.formatError(500, 'Internal server error');
  }
};

const getActiveTeams = async (req, res) => {
  try {
    const players = await Team.find({}, { _id: 0, __v: 0 });
    res.formatResponse(200, 'Success', players);
  } catch (error) {
    res.formatError(500, 'Internal server error');
  }
};

const getLastNews = async (req, res) => {
  try {
    const news = await News.find({}, { _id: 0, __v: 0 });
    res.formatResponse(200, 'Success', news);
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

// function convertKeysToCamelCase(obj) {
//   const result = {};
//   for (let key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       let camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
//       camelCaseKey = camelCaseKey.charAt(0).toLowerCase() + camelCaseKey.slice(1);
//       result[camelCaseKey] = obj[key];
//     }
//   }
//   return result;
// }

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