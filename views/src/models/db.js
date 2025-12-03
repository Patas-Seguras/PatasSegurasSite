const { Sequelize, DataTypes } = require('sequelize');

const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;
const db_schema = process.env.DB_SCHEMA;
const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    dialect: 'postgres',
    schema: db_schema,
    dialectOptions: {
    connectTimeout: 60000,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
}
});

(async () => {
try {
    console.log("Conectando ao Postgres...")
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
