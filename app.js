// exportador do Express
const express = require('express');
//bcrypt export
const bcrypt = require('bcrypt');
///exportar session
const session = require('express-session')
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
const  { Users, Complaint } = require('./models/db.js');

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
    res.render('home', { title: 'Patas Seguras' });
})

app.post('/register-page', async (req, res) => {
    console.log('req.body:', req.body);
try {
    const { email, password, passwordAgain } = req.body;

    // Validação básica
    if (!email || !password || !passwordAgain) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    if (password !== passwordAgain) {
        console.error('Erro, as senhas não coincidem.')
        return res.status(400).send('As senhas não coincidem.');
    }
    // criando variavel de usuario exintente e usando o comando findone para varredura no banco de dados, onde se email for encontrado, dá erro
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).send('Este e-mail já está registrado.');
    }
    // Hashing da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    //comando para criar usuario e enviar para o banco de dados
    await Users.create({ email, pass_word: hashedPassword });

    res.status(201).render('home');
} catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    res.status(500).send('Erro interno no servidor.');
}
});

app.post('/complaint-page', async (req, res) => {
    try {
        const {whichComplaint, location, description, anonymous} = req.body;

        if(!whichComplaint || !location || !description){
            return res.status(400).send("Os campos obrigatórios precisam ser preenchidos.")
        }
        await Complaint.create({whichComplaint, location, description, anonymous});
        
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