const express = require('express');
const {
  getUsers,
  getUserProfile,
  postCreateUser,
  putUpdateUser,
  putUpdateUserProfile,
  deleteUserController,
} = require('../controllers/user.controller');
const {auth} = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', getUsers);
router.get('/me', auth, getUserProfile);
router.post('/', postCreateUser);
router.put('/:userId', putUpdateUser);
router.put('/me', auth, putUpdateUserProfile);
router.delete('/:userId', deleteUserController);

module.exports = router;
