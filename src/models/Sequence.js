const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define(
		'Sequence',
		{
			name: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			start: {
				type: DataTypes.INTEGER,
			},
		},
		{ timestamps: false }
	);
};
