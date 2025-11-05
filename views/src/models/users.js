const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db')

const users = sequelize.define('users', {
email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
},
pass_word: {
    type: DataTypes.STRING,
    allowNull: false
},
isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
}
});

module.exports = users;