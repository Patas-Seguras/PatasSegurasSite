const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users'); 


const registerUser = async (req, res) => {
    console.log(req.email)
    try {
        const { email, password, passwordAgain } = req.body;

        if (!email) {
            return res.status(422).json({ 
                success: false,
                msg: 'O e-mail é obrigatório' 
            });
        }

        if (!password) {
            return res.status(422).json({ 
                success: false,
                msg: 'A senha é obrigatória' 
            });
        }
        
        if (password !== passwordAgain) {
            return res.status(422).json({ 
                success: false,
                msg: 'As senhas não coincidem.' 
            });
        }

        // Verifica se o usuário já existe no banco de dados
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(422).json({ 
                success: false,
                msg: 'Este e-mail já está registrado.' 
            });
        }

        // Hashing da senha
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Comando para criar usuário e enviar para o banco de dados
        await Users.create({
            email,
            pass_word: hashedPassword,
            isAdmin: true
        });

        return res.status(201).json({
            success: true, 
            msg: 'Usuário registrado com sucesso.' 
        });
        
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
        
        return res.status(500).json({
            success: false, 
            msg: 'Erro interno no servidor.' 
        });
    }
};

// Login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(422).json({
            success: false,
            msg: 'Insira um email e senha.' 
        });
        }

        const user = await Users.findOne({ where: { email } });

        let passwordMatch = false;

        if (user) {
            passwordMatch = await bcryptjs.compare(password, user.pass_word);
        }

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                msg: 'Email ou senha incorretos' 
            });
        }

        // Geração do Token
        const secret = process.env.SECRET; 
        if (!secret) {
            console.error(' SECRET não configurada no .env');
            return res.status(500).json({success:false, msg: 'Erro de configuração do servidor.' });
        }
        const token = jwt.sign(
            { id: user.id }, // Assume user.id é o ID do Sequelize
            secret,
            { expiresIn: '1h' }
        );
        
        // Se estiver usando sessões (express-session) E JWT,
        // é aqui que você define a sessão.
        req.session.users = {
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin
        };

        // Resposta de sucesso ÚNICA (JSON com o token)
        console.log(`O usuário ${user.email} foi autenticado`);
        return res.status(200).json({
            success: true,
            msg: 'login realizado',
            token: token,
            redirect: '/admin'
        })
        // A linha "res.redirect('/home')" foi removida daqui!
        
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        // Garante que é uma resposta de erro única (500)
        return res.status(500).json({ 
            success: false,
            msg: 'Erro interno no servidor.' 
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};
