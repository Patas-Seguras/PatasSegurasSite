// Módulo para chamar o Express
const express = require('express');
//rota para a pasta db.js
const { sequelize } = require('./models/db');
//import bodyParses
const bodyParser = require('body-parser');
//Modulo para chamar o html
const http = require('http');
// Rota querystring
const querystring = require('querystring');
// Módulo para chamar o Handlebars
const { engine } = require('express-handlebars');
// export para chamar a rota
const path = require('path');
// export para chamar o MySQL
const mysql = require('mysql2');
// Inicializa o Express
const app = express();


// Módulo para chamar o Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));
// Módulo da rota do CSS
app.use('/css', express.static('./views/assets/css'));
// Rota do JavaScript
app.use('/js', express.static('./views/assets/js'));

// Configuração do Handlebars
app.engine('handlebars', engine({
    extname: '.handlebars', // Extensão dos arquivos Handlebars
    defaultLayout: 'main', // Layout padrão
    layoutsDir: path.join(__dirname, 'views/layouts'), // Pasta dos layouts
    partialsDir: path.join(__dirname, 'views/partials'), // Pasta dos partials
}));
app.set('view engine', 'handlebars'); // Define o mecanismo de visualização
app.set('views', path.join(__dirname, '/views')); // Define o diretório das views
app.use(express.static(path.join(__dirname, '/assets'))); // Pasta estática para assets
// Dados que serao manipulados via rotas
app.use(bodyParser.json()); // O Express irá entender JSON
app.use(bodyParser.urlencoded({ extended: true })); // O Express irá entender URL

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('home', { title: 'Patas Seguras' }); // Renderiza a página 'home.handlebars'
});

// Rota para a página de registro
app.get('/register-page.handlebars', (req, res) => {
    res.render('register-page', { title: 'Cadastro'}); // Renderiza a página 'register-page.handlebars'
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.handlebars');
});
app.post('db.patasseguras', (req, res) =>{
    res.send('nome ' + req.body.nome + " email " + req.body.email + "senha" + req.body.senha)
})

// Inicia o servidor
const port = 8080;
app.listen(port, () => {
    console.log('Servidor iniciado na porta: ' + port);
});
