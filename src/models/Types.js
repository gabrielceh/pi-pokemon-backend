const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('Types', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: true,
		},
		order: {
			type: DataTypes.INTEGER,
		},
	});
};
