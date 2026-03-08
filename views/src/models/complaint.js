const { DataTypes } = require('sequelize')
const sequelize = require('./db')

const Complaint = sequelize.define('Complaint', {
    animal: DataTypes.STRING,
    complaintType: DataTypes.STRING,
    name: DataTypes.STRING,
    number: DataTypes.STRING,
    email: DataTypes.STRING,
    city: DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: {
        type: DataTypes.ENUM(
            'pending',
            'in_analysis',
            'urgent',
            'resolved'
        ),
        defaultValue: 'pending'
    }
}, {
    tableName: 'complaints',
    schema: 'system',
    timestamps: true
})

module.exports = Complaint