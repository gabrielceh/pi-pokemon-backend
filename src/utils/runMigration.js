async function runMigration(sequelize, createSequence) {
	try {
		await sequelize.authenticate();
		console.log('Conexión establecida correctamente.');

		// Ejecuta la migración
		await createSequence(sequelize);

		console.log('Migración completada.');
	} catch (error) {
		console.error('Error en la migración:', error);
	}
}

module.exports = { runMigration };
