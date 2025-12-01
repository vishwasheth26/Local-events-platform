const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:id', userController.getUserProfile);
router.put('/:id', authMiddleware, userController.updateUserProfile);
router.get('/:id/events', userController.getUserEvents);
router.get('/:id/groups', userController.getUserGroups);

module.exports = router;
