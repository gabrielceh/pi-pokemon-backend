const { getPokemonData } = require('../../utils/getPokemonData');
const { limitToSearchInApi } = require('../../utils/optionToFindPokemon');
const { orderPokemonList } = require('../../utils/orderPokemonList');
const { pagination } = require('../../utils/pagination');
const { POKE_API_URL, POKEMON_SOURCE } = require('../../utils/pokeApiUrl');
const { getPokemonSlice } = require('../../utils/pokemonSlice');

let pokemonApiList = [];
/**Funcion que solo optione los pokemon de la api para la opcion de filtar por api o usuarios */
const getApiPokemon = async (req, res) => {
	try {
		let { offset, limit, orderby, ordertype } = req.query;

		if (!pokemonApiList.length) {
			const apiPokemon = await fetch(
				`${POKE_API_URL}/${POKEMON_SOURCE}/?offset=0&limit=${limitToSearchInApi}`
			);
			const { results } = await apiPokemon.json();

			pokemonApiList = await Promise.all(results.map((pokemon) => getPokemonData(pokemon.name)));
		}

		let pokemonData = [...pokemonApiList];

		if (orderby && ordertype) {
			pokemonData = orderPokemonList([...pokemonApiList], orderby, ordertype);
		}

		offset = offset ? +offset : 0;
		limit = limit ? +limit : 12;

		const orderString = orderby && ordertype ? `&orderby=${orderby}&ordertype=${ordertype}` : '';
		const { count, next, prev, dataList, maxPage, currentPage } = pagination(
			req,
			getPokemonSlice,
			pokemonData,
			offset,
			limit,
			`pokemon-api/pokemon/api/pokemon`,
			orderString
		);

		res.status(200).json({ count, next, prev, results: dataList });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

module.exports = { getApiPokemon };
