const { Op } = require('sequelize');
const CustomError = require('../../classes/CustomError');
const { Pokemon_Api, Pokemon } = require('../../db');
const { getMyHost } = require('../../utils/localhost');
const { optionsApi, optionsUser, limitToSearchInApi } = require('../../utils/optionToFindPokemon');
const { pagination } = require('../../utils/pagination');
const { getPokemonSlice } = require('../../utils/pokemonSlice');
const { POKE_API_URL, POKEMON_SOURCE } = require('../../utils/pokeApiUrl');
const { getPokemonData } = require('../../utils/getPokemonData');
const { orderPokemonList } = require('../../utils/orderPokemonList');
const { default: axios } = require('axios');
const { NAME_REGEX } = require('../../utils/regex');

let pokemonApiList = [];

const getPokemonByName = async (res, name, optionsUser) => {
	try {
		if (!NAME_REGEX.test(name)) {
			return res.status(400).json({ error: `'${name}' is not a valid name` });
		}

		const pokemonUserFinded = await Pokemon.findOne({
			where: {
				name: name.toLowerCase(),
			},
			...optionsUser,
		});

		if (pokemonUserFinded) {
			return res.status(200).json(pokemonUserFinded);
		}

		// const dataApi = await axios.get(`${POKE_API_URL}/${POKEMON_SOURCE}/${name.toLowerCase()}`);
		const dataApi = await getPokemonData(name.toLowerCase());

		if (dataApi.status >= 400) {
			throw new CustomError(400, `Pokemon '${name}' not found`);
		}

		return res.status(200).json(dataApi);
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

const getAllPokemon = async (res, req, optionsUser) => {
	/**Obtine los pokemos originales de la db y los pokemon creados por los usuarios
	 * Los ordena mediante la funcion orderPokemonList
	 * Realiza la paginacion
	 * Devuelve los pokemon ordenados por id(defaul), name o attack
	 */
	try {
		let { offset, limit, orderby, ordertype } = req.query;
		const myHost = getMyHost(req);

		if (!pokemonApiList.length) {
			const apiPokemon = await axios.get(
				`${POKE_API_URL}/${POKEMON_SOURCE}/?offset=0&limit=${limitToSearchInApi}`
			);
			const { results } = apiPokemon.data;

			pokemonApiList = await Promise.all(results.map((pokemon) => getPokemonData(pokemon.name)));
		}
		const pokemonUserList = await Pokemon.findAll(optionsUser);

		let pokemonData = [...pokemonApiList, ...pokemonUserList];

		if (orderby && ordertype) {
			pokemonData = orderPokemonList([...pokemonApiList, ...pokemonUserList], orderby, ordertype);
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
			`pokemon-api/pokemon`,
			orderString
		);

		res.status(200).json({ count, next, prev, results: dataList });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

const getPokemon = (req, res) => {
	let { name } = req.query;

	if (name) {
		return getPokemonByName(res, name, optionsUser);
	} else {
		return getAllPokemon(res, req, optionsUser);
	}
};

module.exports = { getPokemon };
