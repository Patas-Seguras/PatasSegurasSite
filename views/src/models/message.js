const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Complaint = require('./complaint');

const Message = sequelize.define('message', {
    denunciaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'denuncia_id'
    },
    remetente: {
        type: DataTypes.ENUM('admin', 'usuario'),
        allowNull: false,
        defaultValue: 'admin'
    },
    texto: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true,
    updatedAt: false
});

Complaint.hasMany(Message, { foreignKey: 'denunciaId', as: 'messages' });
Message.belongsTo(Complaint, { foreignKey: 'denunciaId' });

module.exports = Message;
