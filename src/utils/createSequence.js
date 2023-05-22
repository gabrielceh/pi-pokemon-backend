const { Sequelize } = require('sequelize');

async function createSequence(sequelize) {
	// Verificar si la secuencia ya existe en la base de datos
	const result = await sequelize.query(
		"SELECT EXISTS(SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'id_pokemon_user_secuence');",
		{ type: Sequelize.QueryTypes.SELECT }
	);

	const sequenceExists = result[0].exists;

	if (!sequenceExists) {
		// Crear la secuencia solo si no existe
		await sequelize.query('CREATE SEQUENCE id_pokemon_user_secuence START WITH 20000;');
	} else {
		console.log('La secuencia ya existe en la base de datos.');
	}
}

module.exports = { createSequence };
