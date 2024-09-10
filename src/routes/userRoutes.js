const express = require('express');
const { loginUser, getUsers, addUser, updateUserDetails, removeUser } = require('../controllers/userController');
const router = express.Router();

router.post('/login', loginUser);
router.get('/users', getUsers);
router.post('/users', addUser);
router.put('/users/:id', updateUserDetails);
router.delete('/users/:id', removeUser);

module.exports = router;
