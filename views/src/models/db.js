<<<<<<< HEAD
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
=======
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
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
});

(async () => {
try {
<<<<<<< HEAD
    console.log("Conectando ao MySQL...")
    await sequelize.authenticate();
    console.log('Conexão bem-sucedida ao MySQL via Sequelize!');
} catch (error) {
    console.error('Erro ao conectar ao MySQL:', error);
=======
    console.log("Conectando ao Postgres...")
    await sequelize.authenticate();
    console.log('Conexão bem-sucedida ao Postgres via Sequelize!');
} catch (error) {
    console.error('Erro ao conectar ao Postgres:', error);
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
}
})();

// Sincroniza os modelos com o banco de dados
/*(async () => {
  await sequelize.sync({ force: true }); // Use `force: true` apenas para testes (apaga e recria as tabelas)
console.log('Tabelas sincronizadas!');
})();*/



module.exports = sequelize;
