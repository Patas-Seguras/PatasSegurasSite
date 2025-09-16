const express = require('express');

require('dotenv').config();

const session = require('express-session');

const querystring = require('querystring');

const { engine } = require('express-handlebars');

var path = require('path');

const app = express();

const complaintRoutes = require('./views/src/routes/complaintRoutes.js'); // Importa as rotas de denúncia
const authRoutes = require('./views/src/routes/authRoutes.js'); // Importa as tuas rotas de autenticação
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

// As rotas de autenticação, agora de forma modular e organizada
app.use('/', authRoutes);
app.use('/', complaintRoutes);

// As rotas que não estão em ficheiros separados
app.get('/', (req, res) => {
    res.render('home', { title: 'Patas Seguras' });
});

app.get('/complaint-page', (req, res) => {
    res.render('complaint-page', { title: 'Página de denuncia' });
});

app.get('/register-page', (req, res) => {
    res.render('register-page', { title: 'Cadastro' });
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



// Inicia o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Servidor iniciado na porta: ' + port);
});