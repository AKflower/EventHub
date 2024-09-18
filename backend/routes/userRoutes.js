// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Các endpoint liên quan đến người dùng
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);
router.put('/users/:id/soft-delete', userController.softDeleteUser);
router.patch('/users/:id/change-password',userController.changePassword)
module.exports = router;
