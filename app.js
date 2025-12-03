const express = require('express');

require('dotenv').config();

const jwt = require('jsonwebtoken');

const session = require('express-session');

const querystring = require('querystring');

const { engine } = require('express-handlebars');

var path = require('path');

const app = express();

const SECRET = process.env.SECRET


const complaintRoutes = require('./views/src/routes/complaintRoutes.js'); // Importa as rotas de denúncia
const authRoutes = require('./views/src/routes/authRoutes.js'); // Importa as tuas rotas de autenticação
const users = require('./views/src/models/users.js');
// Configuração de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', engine({
    extname: '.ejs', // Extensão dos arquivos Handlebars
    defaultLayout: 'main', // Layout padrão
    layoutsDir: path.join(__dirname, 'views/layouts'), // Pasta dos layouts
    partialsDir: path.join(__dirname, 'views/partials'), // Pasta dos partials
}));
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
app.use('/css', express.static('/public/css'));
app.use('/js', express.static('/public/js'));
app.set('view engine', 'ejs');
app.use('/img', express.static(path.join(__dirname, 'public/img')));
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
})
// As rotas de autenticação, agora de forma modular e organizada
app.use('/', authRoutes);
app.use('/', complaintRoutes);

// As rotas que não estão em ficheiros separados
app.get('/', (req, res) => {
    res.render('home', { title: 'Patas Seguras' });
});

app.get('/complaint-map', (req, res) => {
    res.render('complaint-map', { title: 'Página de denuncia' });
});

app.get('/register-page', (req, res) => {
    res.render('register-page', { title: 'Cadastro' });
});
app.get('/login-page', (req, res) => {
    res.render('login-page', { title: 'Login' });
});

app.get('/home', (req, res) => {
    res.render('home', { title: 'Patas Seguras' });
});

app.get('/ong-map', (req, res) => {
    res.render('ong-map', { title: 'Mapa das ONGS' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'Sobre o site' });
});

const privateRoutes = require('./views/src/routes/adminRoutes.js');
app.use('/', privateRoutes);


// Inicia o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Servidor iniciado na porta: ' + port);
});