const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db')

const complaint = sequelize.define('complaint', {
animal: {
    type: DataTypes.STRING,
    allowNull: false
},
complaintType:{
    type: DataTypes.STRING,
    allowNull: false
},
name:{
    type: DataTypes.STRING,
    allowNull: false
},
number: {
    type: DataTypes.STRING,
    allowNull: false
},
photos: {
    type: DataTypes.BLOB('long'),
    allowNull: true
},
location: {
    type: DataTypes.STRING,
    allowNull: false
},
description: {
    type: DataTypes.TEXT,
    allowNull: false
},
status: {
    type: DataTypes.ENUM('Ativa','Desativada', 'Concluída'),
    defaultValue: 'Ativa'
}
});

module.exports = complaint;
