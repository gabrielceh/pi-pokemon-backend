const { DataTypes, literal } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
	// defino el modelo
	/**CREATE SEQUENCE id_pokemon_user_secuence START 20000;
	 * En la base de datos se creó la secuencia anterior.
	 * Esto con el fin de que los id de los pokemon creados por el usuario
	 * empiecen desde 20000
	 */
	sequelize.define('Pokemon', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			defaultValue: sequelize.literal("nextval('id_pokemon_user_secuence')"),
			allowNull: true,
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
			defaultValue: 1,
			validate: {
				min: {
					args: [1],
					msg: 'hp min should be 1',
				},
				max: {
					args: [255],
					msg: 'hp max should be 255',
				},
			},
		},
		attack: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
			validate: {
				min: {
					args: [1],
					msg: 'Min attack should be 1',
				},
				max: {
					args: [255],
					msg: 'Max attack should be 255',
				},
			},
		},
		defense: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
			validate: {
				min: {
					args: [1],
					msg: 'Min defense should be 1',
				},
				max: {
					args: [255],
					msg: 'Max defense should be 255',
				},
			},
		},
		special_attack: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
			validate: {
				min: {
					args: [1],
					msg: 'Min special attack should be 1',
				},
				max: {
					args: [255],
					msg: 'Max special attack should be 255',
				},
			},
		},
		special_defense: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
			validate: {
				min: {
					args: [1],
					msg: 'Min special defense should be 1',
				},
				max: {
					args: [255],
					msg: 'Max special defense should be 255',
				},
			},
		},
		speed: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
			validate: {
				min: {
					args: [1],
					msg: 'Min speed should be 1',
				},
				max: {
					args: [255],
					msg: 'Max speed should be 255',
				},
			},
		},
		height: {
			type: DataTypes.FLOAT,
			defaultValue: 1,
			validate: {
				min: {
					args: [1],
					msg: 'Min height should be 1',
				},
				max: {
					args: [999],
					msg: 'Max height should be 999',
				},
			},
		},
		weight: {
			type: DataTypes.FLOAT,
			defaultValue: 1,
			validate: {
				min: {
					args: [1],
					msg: 'Min weight should be 1',
				},
				max: {
					args: [999],
					msg: 'Max weight should be 999',
				},
			},
		},
	});
};
