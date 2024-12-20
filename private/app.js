//modulo para chamar o express
const express = require('express');
//modulo para chamar a rota
const path = require('path');
//modulo para chamar o mysql
const mysql = require('mysql2')
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
