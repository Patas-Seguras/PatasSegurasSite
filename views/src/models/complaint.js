const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db')

const complaint = sequelize.define('complaint', {
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
},
status: {
    type: DataTypes.ENUM('Ativa','Desativada', 'Concluída'),
    defaultValue: 'Ativa'
}
});

module.exports = complaint;
