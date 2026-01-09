const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const useLocal = process.env.USE_LOCAL_DB === '0';

const config = {
    host: useLocal ? process.env.DB_HOST_LOCAL : process.env.DB_HOST_PROD,
    database: useLocal ? process.env.DB_NAME_LOCAL : process.env.DB_NAME_PROD,
    port: process.env.DB_PORT,
    user: useLocal ? process.env.DB_USER_LOCAL : process.env.DB_USER_PROD,
    password: useLocal ? process.env.DB_PASSWORD_LOCAL : process.env.DB_PASSWORD_PROD,
    logging: false,
};
const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'postgres',
    schema: process.env.DB_SCHEMA,
    logging: config.logging,
    dialectOptions: {
    connectTimeout: 60000,
    ssl: useLocal? false: {
        require: true,
        rejectUnauthorized: false
    }
}
});

(async () => {
try {
    console.log(`Conectando a: ${useLocal ? 'LOCAL' : 'RENDER'}`);
    await sequelize.authenticate();
    console.log('Conexão bem-sucedida ao Postgres via Sequelize!');
} catch (error) {
    console.error('Erro ao conectar ao Postgres:', error);
}
})();

// Sincroniza os modelos com o banco de dados
/*(async () => {
  await sequelize.sync({ force: true }); // Use `force: true` apenas para testes (apaga e recria as tabelas)
console.log('Tabelas sincronizadas!');
})();*/



module.exports = sequelize;
