const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middlewares/authMiddleware');

// Validation rules
const createGroupValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty()
];

// Routes
router.post('/', [authMiddleware, createGroupValidation], groupController.createGroup);
router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroupById);
router.post('/:id/join', authMiddleware, groupController.joinGroup);
router.post('/:id/leave', authMiddleware, groupController.leaveGroup);
router.put('/:id', authMiddleware, groupController.updateGroup);
router.delete('/:id', authMiddleware, groupController.deleteGroup);

module.exports = router;
