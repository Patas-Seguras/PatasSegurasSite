const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/authController');

// Rota para processar o formulário de registo (POST)
router.post('/register-page', registerUser);

router.post('/login-page', loginUser);

module.exports = router;