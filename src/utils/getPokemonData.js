const { default: axios } = require('axios');
const { POKEMON_SOURCE, POKE_API_URL } = require('./pokeApiUrl');
const CustomError = require('../classes/CustomError');

async function getPokemonData(pokemonName) {
	try {
		const response = await axios.get(`${POKE_API_URL}/${POKEMON_SOURCE}/${pokemonName}`);

		const { data } = response;
		console.log(data);
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
	} catch (error) {
		if (error.response.status < 500) return { status: error.response.status };

		throw new CustomError(500, error.message);
	}
}

module.exports = { getPokemonData };
