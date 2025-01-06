//modulo para chamar o mysql
const mysql = require('mysql2')
//teste de conexão
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
//modulo para chamar o express
const express = require('');express
//modulo para chamar a rota
const path = require('path');
//nome do express
const app = express();
//Aqui está dizendo que os arquivos da pasta 'public' sejam acessados diretamente pelo navegador
app.use(express.static(path.join(__dirname, '../public')));
//aqui dita que ao acessar a url o servidor me dará a pagina HTML para exibir
app.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

const port = 8080
app.listen(port, () =>{
    console.log('Servidor iniciado na porta: ' + port);
});
