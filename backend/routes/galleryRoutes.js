const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');

router.post('/galleries', galleryController.upload.single('image'), galleryController.addImage);
router.get('/galleries/:id', galleryController.getImageById);

module.exports = router;
