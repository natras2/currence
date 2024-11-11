const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
        // Model attributes are defined here
        firebaseUid: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        }
    }
);

module.exports = User;

