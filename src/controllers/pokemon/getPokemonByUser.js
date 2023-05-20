const CustomError = require('../../classes/CustomError');
const { User, Pokemon } = require('../../db');
const { getMyHost } = require('../../utils/localhost');
const { optionsUser } = require('../../utils/optionToFindPokemon');
const { orderPokemonList } = require('../../utils/orderPokemonList');
const { pagination } = require('../../utils/pagination');
const { getPokemonSlice } = require('../../utils/pokemonSlice');

const getPokemonByUser = async (req, res) => {
	/**Busca al pokemon segun el id del usuario que lo creó */
	try {
		const { userId } = req.params;
		let { offset, limit, orderby, ordertype } = req.query;
		const myHost = getMyHost(req);

		const userFound = await User.findByPk(userId);

		if (!userFound) throw new CustomError(400, 'User not found');

		const pokemonByUser = await Pokemon.findAll({
			where: { userId },
			...optionsUser,
		});

		offset = offset ? +offset : 0;
		limit = limit ? +limit : 6;

		let pokemonData = [...pokemonByUser];

		if (orderby && ordertype) {
			pokemonData = orderPokemonList([...pokemonByUser], orderby, ordertype);
		}
		const orderString = orderby && ordertype ? `&orderby=${orderby}&ordertype=${ordertype}` : '';

		const { count, next, prev, dataList, maxPage, currentPage } = pagination(
			req,
			getPokemonSlice,
			pokemonData,
			offset,
			limit,
			`pokemon-api/pokemon/user/${userId}`,
			orderString
		);

		res.status(200).json({ count, next, prev, results: dataList });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

module.exports = { getPokemonByUser };
