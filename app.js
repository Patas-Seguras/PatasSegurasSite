// Módulo para chamar o Express
const express = require('express');
// Módulo para chamar o Handlebars
const { engine } = require('express-handlebars');
// Módulo para chamar a rota
const path = require('path');
// Módulo para chamar o MySQL
const mysql = require('mysql2');

// Nome do Express
const app = express();

// Configuração do Handlebars
app.engine('handlebars', engine({
    extname: '.handlebars', // Extensão dos arquivos Handlebars
    defaultLayout: 'main', // Layout padrão
    layoutsDir: path.join(__dirname, 'views/layouts'), // Pasta dos layouts
    partialsDir: path.join(__dirname, 'views/partials'), // Pasta dos partials
}));
app.set('view engine', 'handlebars'); // Define o mecanismo de visualização
app.set('views', path.join(__dirname, 'views')); // Define o diretório das views

// Conexão com o MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'db_patasseguras'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao se conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados com sucesso!');
    }
});

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('home', { title: 'Patas Seguras' }); // Renderiza a página 'home.handlebars'
});

// Inicia o servidor
const port = 8080;
app.listen(port, () => {
    console.log('Servidor iniciado na porta: ' + port);
});