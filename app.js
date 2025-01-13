//modulo para chamar o express
const express = require('express');
//modulo para chamar o Handle-bars
const { engine } = require('express-handlebars');
//modulo para chamar a rota
const path = require('path');
//nome do express
const app = express();
//modulo para chamar o mysql
const mysql = require('mysql2');
//configs do handlebars
app.engine('handlebars', engine());
app.set('views engine', 'handlebars');
app.set('views', './views');
//mais configs do handlebars
app.engine('handlebars', engine({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}))
app.set('views engine', 'handlebars');
app.set('views',path.join(__dirname, 'public'))
//teste de conexão do db
const db = mysql.createConnection({
    host: '127.0.0.1',
    user:'root',
    password: '',
    database:'db_patasseguras'
})

db.connect((err) =>{
    if(err){
        console.error('Erro ao se conectar *0*');
    }else {
        console.log('Conectado com sucesso!!');
    }
});

//rota handlebars
app.get('/', (req, res) => {
    res.render('home', {title: 'Patas Seguras'})
})
const port = 8080
app.listen(port, () =>{
    console.log('Servidor iniciado na porta: ' + port);
});
