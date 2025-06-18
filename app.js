// exportador do Express
const express = require('express');
//bcrypt export
const bcrypt = require('bcrypt');
//export collection
const  { collection, collection2 } = require('./models/db.js');
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
app.use(express.urlencoded({ extended: false })); // O Express irá entender URL
// Rota para a página inicial
app.get('/', (req, res) => {
    res.render('home', { title: 'Patas Seguras' }); // Renderiza a página 'home.handlebars'
});

// Rota para a página de registro
app.get('/register-page', (req, res) => {
    res.render('register-page.ejs', { title: 'Cadastro'}); // Renderiza a página 'register-page.handlebars'
});
app.get('/complaint-page', (req, res) => {
    res.render('complaint-page.ejs', { title: 'Página de denuncia'}); // Renderiza a página 'complaint-page.handlebars'
});

app.get('/home', (req, res) => {
    res.render('home.ejs')
})



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
app.post('/register-page', async (req, res) =>{
    try{
        const data = {
            email: req.body.email,
            password: req.body.password,
            passwordAgain: req.body.passwordAgain
        }
        if ( req.body.password != req.body.passwordAgain){
            res.send(`<script>
                alert("As senhas não coincidem");
                window.location.href = "/register-page"; // Redireciona após o alerta
            </script>`)
        } else {
        //hashing the password
            const saltRounds = 5;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword;

            const userData = await collection.insertOne({
                email: data.email,
                password: hashedPassword
            });
            console.log(userData);

            res.redirect('/complaint-page');
        }
    }catch (error) {
        console.error("Erro ao conectar o usuário: ", error);
        res.status(500).send("Erro interno no servidor")
    }
    
}); 