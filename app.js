// exportador do Express
const express = require('express');
//bcrypt export
const bcrypt = require('bcrypt');
//export collection
const  { collection, collection2 } = require('./models/db.js');
///exportar session
const session = require('express-session')
//import bodyParses
const bodyParser = require('body-parser');
//Modulo para chamar o html
const http = require('http');
// Rota querystring
const querystring = require('querystring');
// Módulo para chamar o Handlebars
const { engine } = require('express-handlebars');
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

// Configuração do Handlebars
app.engine('ejs', engine({
    extname: '.ejs', // Extensão dos arquivos Handlebars
    defaultLayout: 'main', // Layout padrão
    layoutsDir: path.join(__dirname, 'views/layouts'), // Pasta dos layouts
    partialsDir: path.join(__dirname, 'views/partials'), // Pasta dos partials
}));
app.set('view engine', 'ejs'); // Define o mecanismo de visualização
app.set('views', path.join(__dirname, '/views')); // Define o diretório das views
app.use(express.static(path.join(__dirname, '/assets'))); // Pasta estática para assets
app.use(express.json())
app.use(express.urlencoded({ extended: false })); // O Express irá entender URL

// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('home', { title: 'Patas Seguras' }); // Renderiza a página 'home.handlebars'
});

// Rota para a página de registro
app.get('/register-page.ejs', (req, res) => {
    res.render('register-page', { title: 'Cadastro'}); // Renderiza a página 'register-page.handlebars'
});
app.get('/complaint-page.ejs', (req, res) => {
    res.render('complaint-page', { title: 'Página de denuncia'}); // Renderiza a página 'complaint-page.handlebars'
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.ejs');
});

app.get('/', (req, res) => {
    res.render('register-page', { title: 'Cadastro'});
});

app.get('/ini', (req, res) => {
    res.render('home')
})

app.post('/register-page.ejs', async (req, res) =>{
    const data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    //checkando se usuario ja existe
    const exitingUser = await collection.findOne({name: data.name}); //faz a varredura da coleção
    if(exitingUser){
        return res.send('User already exist');
    }else {
    //hashing the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword;

    const userData = await collection.insertMany(data);
    console.log(userData);  

    res.redirect('/complaint-page.ejs');
    }
});
app.post('/complaint-page.ejs', async (req, res) =>{
    const data = {
        whichComplaint: req.body.whichComplaint,
        location: req.body.location,
        description: req.body.description,
        anonymous: req.body.anonymous === 'on'
    };
    
    try{
        const complaintData = await collection2.insertMany(data);
        console.log(complaintData);
        res.redirect('/complaint-page.ejs');    
    }catch(err){
        console.log('Erro ao inserir denúncia', err);
        res.status(500).send('Erro ao registrar denúncia');
    }
});

// Inicia o servidor
const port = 8080;
app.listen(port, () => {
    console.log('Servidor iniciado na porta: ' + port);
});
