const express = require('express');
const router = express.Router();
const { 
    getCurrentUser,
    getActivePlayers,
    getActiveTeams,
    getLastNews,
    getUserTeam,
    createUserTeam,
    getNewsDetails,
    removeUserTeam,
    updateUserTeam
} = require('../controllers/data');

router.get('/user', getCurrentUser);
router.get('/players/active', getActivePlayers);
router.get('/teams/active', getActiveTeams);
router.get('/news', getLastNews);
router.get('/news/:id', getNewsDetails);
router.get('/teams/load', getUserTeam);
router.post('/teams/create', createUserTeam);
router.put('/teams/update', updateUserTeam);
router.delete('/teams/delete', removeUserTeam);

module.exports = router;