const { Pokemon } = require('../../db');
const { getMyHost } = require('../../utils/localhost');
const { optionsUser } = require('../../utils/optionToFindPokemon');
const { orderPokemonList } = require('../../utils/orderPokemonList');
const { pagination } = require('../../utils/pagination');
const { getPokemonSlice } = require('../../utils/pokemonSlice');

const getUsersPokemon = async (req, res) => {
	try {
		let { offset, limit, orderby, ordertype } = req.query;
		const myHost = getMyHost(req);

		const pokemonUser = await Pokemon.findAll({
			...optionsUser,
		});

		offset = offset ? +offset : 0;
		limit = limit ? +limit : 12;

		let pokemonData = [...pokemonUser];

		if (orderby && ordertype) {
			pokemonData = orderPokemonList([...pokemonData], orderby, ordertype);
		}
		const orderString = orderby && ordertype ? `&orderby=${orderby}&ordertype=${ordertype}` : '';

		const { count, next, prev, dataList, maxPage, currentPage } = pagination(
			req,
			getPokemonSlice,
			pokemonData,
			offset,
			limit,
			`pokemon-api/pokemon/users/pokemon`,
			orderString
		);

		res.status(200).json({ count, next, prev, results: dataList });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

module.exports = { getUsersPokemon };
