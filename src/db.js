require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_URL, MODE } = process.env;

// development
// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`, {
// 	logging: false, // set to console.log to see the raw SQL queries
// 	native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });

const db_conn =
	MODE === 'production' ? DB_URL : `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/pokemon`;

// produccion
const sequelize = new Sequelize(db_conn, {
	logging: false, // set to console.log to see the raw SQL queries
	native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
	.filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
	.forEach((file) => {
		modelDefiners.push(require(path.join(__dirname, '/models', file)));
	});

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Pokemon, Types, Pokemon_Api, User, Blacklist } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

Pokemon.belongsToMany(Types, { through: 'pokemon_types' });
Types.belongsToMany(Pokemon, { through: 'pokemon_types' });

Pokemon_Api.belongsToMany(Types, { through: 'pokemon_api_types' });
Types.belongsToMany(Pokemon_Api, { through: 'pokemon_api_types' });

Pokemon.belongsToMany(User, { through: 'user_pokemon' });
User.belongsToMany(Pokemon, { through: 'user_pokemon' });

// 1:N
Pokemon.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' }); // lave foranea, onDelete eliminará el registro de todas las bd
User.hasMany(Pokemon, { foreignKey: 'userId' }); // solo creará esta llave foranea y no la que crea por defecto

module.exports = {
	...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
	Types,
	Pokemon,
	Pokemon_Api,
	User,
	Blacklist,
	conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
