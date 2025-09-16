const express = require('express');
const router = express.Router();

const registerUser = require('../controllers/authController');

// Rota para processar o formulário de registo (POST)
router.post('/register-page', registerUser);

module.exports = router;