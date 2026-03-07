const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const complaint = sequelize.define('complaint', {
    animal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    complaintType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reportDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'usuario_id'
    },
    photos: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    photoType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Ativa'
    }
}, {
    timestamps: true
});

module.exports = complaint;
