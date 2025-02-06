// Import Sequelize
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('db_patasseguras', 'root', '', { //conectando com o banco de dados via sequelize
    host: '127.0.0.1',
    dialect: 'mysql',
    port: '3306'
});
sequelize.authenticate() //processo de verificação da conexão com o db
    .then(() => {
        console.log('Conectado ao banco de dados');
    })
    .catch(err => {
        console.error('Erro ao se conectar ao banco de dados:', err);
    });

module.exports = {
    sequelize: Sequelize,
    Sequelize: sequelize 
}
//models Posts
/*const Post = sequelize.define('Post', {
    email: {
        type: Sequelize.STRING;
    },
    senha: {
        type: Sequelize.STRING;
    }
})
Post.sync({force: true}) 
*/
//NÃO MEXER NESSAS LINHAS DE CODIGO!! se você quiser criar uma nova tabela, crie um novo arquivo e copie e cole esse código, mudando o nome da tabela e os campos que você deseja criar.