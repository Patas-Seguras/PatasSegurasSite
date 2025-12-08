const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./db')

const complaint = sequelize.define('complaint', {
<<<<<<< HEAD
whichComplaint: {
    type: DataTypes.STRING,
    allowNull: false
},
name: {
    type: DataTypes.STRING,
    allowNull: true
=======
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
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
},
photos: {
    type: DataTypes.BLOB('long'),
    allowNull: true
},
<<<<<<< HEAD
localization: {
=======
location: {
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
    type: DataTypes.STRING,
    allowNull: false
},
description: {
    type: DataTypes.TEXT,
    allowNull: false
},
<<<<<<< HEAD
anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
},
=======
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c
status: {
    type: DataTypes.ENUM('Ativa','Desativada', 'Concluída'),
    defaultValue: 'Ativa'
}
});

module.exports = complaint;
