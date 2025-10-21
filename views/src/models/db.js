const { name } = require('ejs');
const { Sequelize, DataTypes } = require('sequelize');

const db_name = process.env.DB_NAME;
const db_user = process.env.DB_ROOT;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    dialect: 'mysql',
    dialectOptions: {
        connectTimeout: 60000 
    }
});

(async () => {
try {
    console.log("Conectando ao MySQL...")
    await sequelize.authenticate();
    console.log('Conexão bem-sucedida ao MySQL via Sequelize!');
} catch (error) {
    console.error('Erro ao conectar ao MySQL:', error);
}
})();

// Sincroniza os modelos com o banco de dados
/*(async () => {
  await sequelize.sync({ force: true }); // Use `force: true` apenas para testes (apaga e recria as tabelas)
console.log('Tabelas sincronizadas!');
})();*/



module.exports = sequelize;
