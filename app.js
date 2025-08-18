// exportador do Express
const express = require('express');
//bcrypt export
const bcrypt = require('bcrypt');
///exportar session
const session = require('express-session');
//Modulo para chamar o http
const http = require('http');
// Rota querystring
const querystring = require('querystring');
// Módulo para chamar o Handlebars
const { engine } = require('express-handlebars');
const nodemailer = require('nodemailer');
const crypto = require('crypto')
const upload = require('./config/multer.js');
// export para chamar a rota
var path = require('path');
// Inicializa o Express
const app = express();
// Módulo para chamar o Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
// Módulo da rota do CSS
app.use('/css', express.static('./views/assets/css'));
// Rota do JavaScript
app.use('/js', express.static('./views/assets/js'));
const  { Users, Complaint } = require('./models/db.js');
const { title } = require('process');

// Configuração do Handlebars
app.engine('ejs', engine({
    extname: '.ejs', // Extensão dos arquivos Handlebars
    defaultLayout: 'main', // Layout padrão
    layoutsDir: path.join(__dirname, 'views/layouts'), // Pasta dos layouts
    partialsDir: path.join(__dirname, 'views/partials'), // Pasta dos partials
}));
app.set('view engine', 'ejs'); // Define o mecanismo de visualização
app.use('/img', express.static(path.join(__dirname, 'views/img')));
app.set('views', path.join(__dirname, '/views')); // Define o diretório das views
app.use(express.static(path.join(__dirname, '/assets'))); // Pasta estática para assets
app.use(express.json())
app.use(express.urlencoded({ extended: true })); // O Express irá entender URL
// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('home', { title: 'Patas Seguras' }); // Renderiza a página 'home.handlebars'
});

app.get('/complaint-page', (req, res) => {
    res.render('complaint-page', { title: 'Página de denuncia'}); // Renderiza a página 'complaint-page.handlebars'
});
// Rota para a página de registro
app.get('/register-page', (req, res) => {
    res.render('register-page', { title: 'Cadastro'}); // Renderiza a página 'register-page.handlebars'
});

app.get('/home', (req, res) => {
    res.render('home', { title: 'Patas Seguras'});
})

app.get('/ong-map', (req, res) => {
    res.render('ong-map', { title: 'Mapa das ONGS'});
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'Sobre o site'})
})

app.post('/register-page', async (req, res) => {
    console.log('req.body:', req.body);
try {
    const { email, password, passwordAgain } = req.body;

    // Validação básica do registro
    if (!email || !password || !passwordAgain) {
        return res.status(400).send('erro nos campos obrigatorios.');
    }

    if (password !== passwordAgain) {
        return res.status(400).send('As senhas não coincidem.');
    }
    // criando variavel de usuario exintente e usando o comando findone para varredura no banco de dados, onde se email for encontrado, dá erro
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).send('Este e-mail já está registrado.');
    }
    // Hashing da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    //esse codigo gera um token
    const verificationToken = crypto.randomBytes(32).toString('hex');


    //comando para criar usuario e enviar para o banco de dados
    await Users.create({ email,
        pass_word: hashedPassword,
        isVerified: false,
        verificationToken
});
    //esse aqui é o nodemailer criando o transportador que é o email que envia o email pra conta etc
    const transport = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '7eb1b01fb6820e',
            pass: '333ce8375ab709'
        }
    });

    //aqui ta o link que o usuario clica pra verificação, nao tem muita funcionalidade já que isso nao tem login
    const verificationLink = `http://localhost:8080/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    
    //isso aqui é o codigo pra enviar o email
    await transport.sendMail({
        from: 'patas.seguras@hotmail.com',
        to: email,
        subject: 'Aqui está o link para verificar sua conta do Patas Seguras!',
        html: `<p>Clique no link para verificar seu e-mail: <a href="${verificationLink}">Verificar e-mail</a></p>`
    })
    res.status(201).redirect('home');
} catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    res.status(500).send('Erro interno no servidor.');
}
});

//sistema de verificação do email, preciso fazer ainda
/*app.get('/verify-email', async (req, res) =>{

})*/
app.post('/complaint-page', upload.single('photos'), async (req, res) => {
    try {
        const {whichComplaint, name, localization, description, anonymous} = req.body;
        const photos = req.file
            await Complaint.create({
                whichComplaint,
                name,
                photos: req.file?.buffer || null,
                photoType: req.file?.mimetype || null,
                localization,
                description,
                anonymous: anonymous === 'on' || anonymous === 'true'
            });
        
            res.status(201).render('home');
    } catch (error) {
        console.error('Erro no envio das denúncias: ', error.message);
        res.status(500).send('Erro interno no servidor, por favor retorne a tela anterior.')
    }
});


// Inicia o servidor
const port = 8080;
app.listen(port, () => {
    console.log('Servidor iniciado na porta: ' + port);
});