<<<<<<< HEAD
const bcrypt = require('bcrypt');
=======
const bcryptjs = require('bcryptjs');
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
const jwt = require('jsonwebtoken');
const Users = require('../models/users'); 


const registerUser = async (req, res) => {
    console.log(req.email)
    try {
        const { email, password, passwordAgain } = req.body;

        if (!email) {
<<<<<<< HEAD
            return res.status(422).json({ msg: 'O e-mail é obrigatório' });
        }
        if (!password) {
            return res.status(422).json({ msg: 'A senha é obrigatória' });
        }
        if (password !== passwordAgain) {
            return res.status(422).json({ msg: 'As senhas não coincidem.' });
=======
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
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
        }

        // Verifica se o usuário já existe no banco de dados
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
<<<<<<< HEAD
            return res.status(422).json({ msg: 'Este e-mail já está registrado.' });
        }

        // Hashing da senha
        const hashedPassword = await bcrypt.hash(password, 10);
=======
            return res.status(422).json({ 
                success: false,
                msg: 'Este e-mail já está registrado.' 
            });
        }

        // Hashing da senha
        const hashedPassword = await bcryptjs.hash(password, 10);
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c

        // Comando para criar usuário e enviar para o banco de dados
        await Users.create({
            email,
            pass_word: hashedPassword,
            isAdmin: true
        });

<<<<<<< HEAD
        
        return res.status(201).json({ msg: 'Usuário registrado com sucesso.' });
=======
        return res.status(201).json({
            success: true, 
            msg: 'Usuário registrado com sucesso.' 
        });
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
        
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
        
<<<<<<< HEAD
        return res.status(500).json({ msg: 'Erro interno no servidor.' });
=======
        return res.status(500).json({
            success: false, 
            msg: 'Erro interno no servidor.' 
        });
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
    }
};

// Login user
const loginUser = async (req, res) => {
<<<<<<< HEAD
=======

>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
    try {
        const { email, password } = req.body;

        if (!email || !password) {
<<<<<<< HEAD
            return res.status(422).json({ msg: 'O email e a senha são obrigatórios' });
        }

        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(422).json({ msg: 'Usuário não encontrado' });
        }

        const passwordMatch = await bcrypt.compare(password, user.pass_word);
        if (!passwordMatch) {
            return res.status(401).json({ msg: 'Senha incorreta' });
        }

        // Geração do Token
        const secret = process.env.SECRET || 'seu_segredo_padrao_muito_longo'; // Use seu fallback
        
=======
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
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
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
<<<<<<< HEAD
        console.log(`Ùsuario ${user.email} autenticado com sucesso!`, token)
        return res.redirect('/admin')
=======
        console.log(`O usuário ${user.email} foi autenticado`);
        return res.status(200).json({
            success: true,
            msg: 'login realizado',
            token: token,
            redirect: '/admin'
        })
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
        // A linha "res.redirect('/home')" foi removida daqui!
        
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        // Garante que é uma resposta de erro única (500)
<<<<<<< HEAD
        return res.status(500).json({ msg: 'Erro interno no servidor.' });
=======
        return res.status(500).json({ 
            success: false,
            msg: 'Erro interno no servidor.' 
        });
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
    }
};

module.exports = {
    registerUser,
    loginUser
};
