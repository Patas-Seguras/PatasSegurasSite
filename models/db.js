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

const Users = sequelize.define('Users', {
email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
},
pass_word: {
    type: DataTypes.STRING,
    allowNull: false
},
isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
},
verificationToken: {
    type: DataTypes.STRING,
    allowNull: false
}
});

const Complaint = sequelize.define('Complaint', {
whichComplaint: {
    type: DataTypes.STRING,
    allowNull: false
},
name: {
    type: DataTypes.STRING,
    allowNull: true
},
photos: {
    type: DataTypes.BLOB('long'),
    allowNull: true
},
localization: {
    type: DataTypes.STRING,
    allowNull: false
},
description: {
    type: DataTypes.TEXT,
    allowNull: false
},
anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
}
});

// Sincroniza os modelos com o banco de dados
/*(async () => {
  await sequelize.sync({ force: true }); // Use `force: true` apenas para testes (apaga e recria as tabelas)
console.log('Tabelas sincronizadas!');
})();*/


module.exports = {
    sequelize,
    Users,
    Complaint
};
