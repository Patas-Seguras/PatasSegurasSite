const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Complaint = require('./complaint');

const ComplaintAction = sequelize.define('complaint_action', {
    denunciaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'denuncia_id'
    },
    status: {
        type: DataTypes.ENUM('pendente', 'em_analise', 'urgente', 'resolvido'),
        allowNull: false
    },
    relatorio: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    adminEmail: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'admin_email'
    }
}, {
    timestamps: true,
    updatedAt: false
});

Complaint.hasMany(ComplaintAction, { foreignKey: 'denunciaId', as: 'actions' });
ComplaintAction.belongsTo(Complaint, { foreignKey: 'denunciaId' });

module.exports = ComplaintAction;
