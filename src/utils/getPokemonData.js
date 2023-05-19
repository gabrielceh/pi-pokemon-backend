const { POKEMON_SOURCE, POKE_API_URL } = require('./pokeApiUrl');

async function getPokemonData(pokemonName) {
	const response = await fetch(`${POKE_API_URL}/${POKEMON_SOURCE}/${pokemonName}`);

	if (response.status >= 400) return { status: response.status };

	const data = await response.json();
	let stats = {};
	for (let stat of data.stats) {
		if (stat.stat.name.includes('-')) {
			stats[stat.stat.name.replace('-', '_')] = stat.base_stat;
		} else {
			stats[stat.stat.name] = stat.base_stat;
		}
	}

	let types = [];

	for (let type of data.types) {
		let id = type.type.url.split('/').at(-2);
		let name = type.type.name;
		types.push({ id: +id, name });
	}

	const pokemon = {
		id: data.id,
		name: data.name,
		image: data.sprites.other['official-artwork'].front_default,
		...stats,
		weight: data.weight,
		height: data.height,
		Types: types,
	};

	return pokemon;
}

module.exports = { getPokemonData };
