async function createSequence(Sequence) {
	try {
		// Verifica la existencia de la secuencia
		const sequence = await Sequence.findOne({
			where: { name: 'id_pokemon_user_secuence' },
		});

		if (!sequence) {
			// La secuencia no existe, crea la secuencia
			await Sequence.create({
				name: 'id_pokemon_user_secuence',
				start: 20000,
			});
			console.log('Secuencia creada exitosamente.');
		} else {
			console.log('La secuencia ya existe.');
		}
	} catch (error) {
		console.error('Error al crear la secuencia:', error);
	}
}

module.exports = { createSequence };
