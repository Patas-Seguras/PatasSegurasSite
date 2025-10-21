const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../models/users'); 


const registerUser = async (req, res) => {
    console.log(req.email)
    try {
        const { email, password, passwordAgain } = req.body;

        if (!email) {
            return res.status(422).json({ msg: 'O e-mail é obrigatório' });
        }
        if (!password) {
            return res.status(422).json({ msg: 'A senha é obrigatória' });
        }
        if (password !== passwordAgain) {
            return res.status(422).json({ msg: 'As senhas não coincidem.' });
        }

        // Verifica se o usuário já existe no banco de dados
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(422).json({ msg: 'Este e-mail já está registrado.' });
        }

        // Hashing da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Comando para criar usuário e enviar para o banco de dados
        await Users.create({
            email,
            pass_word: hashedPassword,
            isAdmin: true
        });

        
        return res.status(201).json({ msg: 'Usuário registrado com sucesso.' });
        
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
        
        return res.status(500).json({ msg: 'Erro interno no servidor.' });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
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
        console.log(`Ùsuario ${user.email} autenticado com sucesso!`, token)
        return res.redirect('/admin')
        // A linha "res.redirect('/home')" foi removida daqui!
        
    } catch (error) {
        console.error('Erro ao fazer login:', error.message);
        // Garante que é uma resposta de erro única (500)
        return res.status(500).json({ msg: 'Erro interno no servidor.' });
    }
};

module.exports = {
    registerUser,
    loginUser
};
