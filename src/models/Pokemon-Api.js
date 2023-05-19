const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	/**CREATE SEQUENCE id_pokemon_user_secuence START 20000;
	 * En la base de datos se creó la secuencia anterior.
	 * Esto con el fin de que los id de los pokemon creados por el usuario
	 * empiecen desde 20000
	 */
	sequelize.define('Pokemon_Api', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		image: {
			type: DataTypes.STRING,
			validate: {
				isUrl: true, // Validación para verificar si es una URL
			},
		},
		hp: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		attack: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		defense: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		special_attack: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		special_defense: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		speed: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		height: {
			type: DataTypes.FLOAT,
		},
		weight: {
			type: DataTypes.FLOAT,
		},
	});
};
