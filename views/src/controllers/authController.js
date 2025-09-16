//bcrypt export
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Users = require('../models/users');
const { sendVerificationEmail } = require('../services/emailServices');

const registerUser = async (req, res) => {
    console.log('req.body:', req.body);
    try {
        const { email, password, passwordAgain } = req.body;

        // Validação básica do registro
        if (!email || !password || !passwordAgain) {
            return res.status(400).send('Erro nos campos obrigatórios.');
        }

        if (password !== passwordAgain) {
            return res.status(400).send('As senhas não coincidem.');
        }

        // Criando variável de usuário exintente e usando o comando findOne para varredura no banco de dados
        // Nota: O método `findOne` com `where` é específico do Sequelize,
        // se estiveres a usar Mongoose o método é `findOne` como no exemplo anterior.
        const existingUser = await Users.findOne({ where: { email } }); 
        if (existingUser) {
            return res.status(400).send('Este e-mail já está registrado.');
        }

        // Hashing da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Geração do token de verificação
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Comando para criar usuário e enviar para o banco de dados
        await Users.create({ 
            email,
            pass_word: hashedPassword,
            isVerified: false,
            verificationToken
        });

        // Chama a função do serviço de email para enviar o email de verificação
        await sendVerificationEmail(email, verificationToken);

        res.status(201).redirect('home');
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
        res.status(500).send('Erro interno no servidor.');
    }
};
module.exports = registerUser;
