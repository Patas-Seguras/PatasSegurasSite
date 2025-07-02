const { name } = require('ejs');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('patasseguras_db', 'root', '', {
host: 'localhost',
port: 3306,
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
}
});

const Complaint = sequelize.define('Complaint', {
whichComplaint: {
    type: DataTypes.STRING,
    allowNull: false
},
name: {
    type: DataTypes.STRING,
    allowNull: false
},
photo: {
    type: DataTypes.BLOB,
    allowNull: false
},
location: {
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
})();
*/

module.exports = {
    sequelize,
    Users,
    Complaint
};
