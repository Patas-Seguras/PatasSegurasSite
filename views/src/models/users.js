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
isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
},
verificationToken: {
    type: DataTypes.STRING,
    allowNull: false
}
});

module.exports = users;