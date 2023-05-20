const CustomError = require('../classes/CustomError');
const { Types, Pokemon, Pokemon_Api, User } = require('../db');
const { getTypesFromApi } = require('../utils/getTypesFromApi');
const { pagination } = require('../utils/pagination');
const { POKE_API_URL, TYPE_SOURCE, POKEMON_SOURCE } = require('../utils/pokeApiUrl');
const { getMyHost } = require('../utils/localhost');
const { orderBy, orderTypes } = require('../utils/orderValues');
const { orderPokemonList } = require('../utils/orderPokemonList');
const {
	attributes,
	includeTypes,
	optionsApi,
	optionsUser,
	limitToSearchInApi,
} = require('../utils/optionToFindPokemon');
const { getPokemonData } = require('../utils/getPokemonData');
const { default: axios } = require('axios');

let pokemonApiList = [];

/**Funcion para el paginado de los pokemon de la base de datos */
const filterByIdSlice = (data = [], offset = 0, limit = 12) => {
	const dataSlice = data.slice(offset, offset + limit);
	return dataSlice;
};

/** Obtenemos los pokemos filtrados por el id del tipo y nos devolverá solo el id del los que
 * cumplen con la condicion, y si vienen los parametros orderby y order los ordenará.
 * El bucle for nos ayudará a retornar los datos completos de los pokemon de ese tipo ya que
 * al principio solo devuelve un solo tipo para el pokemon.
 */
const getPokemonByTypesDBList = async (
	model,
	id,
	orderby = null,
	ordertype = null,
	options = {}
) => {
	const order = orderby && ordertype && [[orderby, ordertype]];

	const pokemonByType = await model.findAll({
		order,
		attributes: ['id'],
		include: [
			{
				model: Types,
				attributes: ['id', 'name'],
				through: {
					attributes: [],
				},
				where: { id: id },
			},
		],
	});

	let pokemonWithType = [];

	for (let pok of pokemonByType) {
		const pk = await model.findOne({
			where: { id: pok.id },
			...options,
		});
		pokemonWithType.push(pk);
	}

	return pokemonWithType;
};

const getPokemonByTypesAPIList = (typeId, pokemonList = [], orderby, ordertype) => {
	let filteredData = [];

	for (let pokemon of pokemonList) {
		for (let type of pokemon.Types) {
			if (type.id === typeId) {
				filteredData.push(pokemon);
			}
		}
	}

	filteredData = orderPokemonList(filteredData, orderby, ordertype);

	return filteredData;
};

/**Funcion que nos permitira obtener los types de la api y agregarlos a la base de datos
 * Retornará un arreglo de types
 */
const getTypes = async (req, res) => {
	try {
		const allTypes = await Types.findAll();
		let typeToReturn = [];

		if (!allTypes.length) {
			const typesFromApi = await getTypesFromApi();
			const newTypes = await Types.bulkCreate(typesFromApi);
			typeToReturn = newTypes.map((type) => {
				return {
					id: type.dataValues.id,
					name: type.dataValues.name,
				};
			});
			return res.status(201).json({ results: typeToReturn });
		}

		typeToReturn = allTypes.map((type) => {
			return {
				id: type.dataValues.id,
				name: type.dataValues.name,
			};
		});

		res.status(200).json({ results: typeToReturn });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

const typeFilterById = async (req, res) => {
	try {
		const { id } = req.params;
		let { offset, limit, orderby, ordertype } = req.query;
		const myHost = getMyHost(req);

		if (isNaN(id)) {
			throw new CustomError(404, 'Please, send a numeric id');
		}

		const foundedType = await Types.findByPk(+id);

		if (!foundedType) {
			throw new CustomError(404, 'The type id is not in the data base');
		}

		offset = offset ? +offset : 0;
		limit = limit ? +limit : 12;

		if (!pokemonApiList.length) {
			const apiPokemon = await axios.get(
				`${POKE_API_URL}/${POKEMON_SOURCE}/?offset=0&limit=${limitToSearchInApi}`
			);
			const { results } = apiPokemon.data;

			pokemonApiList = await Promise.all(results.map((pokemon) => getPokemonData(pokemon.name)));
		}

		const getPokemonUserByType = await getPokemonByTypesDBList(
			Pokemon,
			foundedType.id,
			orderby,
			ordertype,
			optionsUser
		);

		const getPokemonApiByType = getPokemonByTypesAPIList(+id, pokemonApiList, orderby, ordertype);

		let listPokemonOrdered = [...getPokemonApiByType, ...getPokemonUserByType];

		if (ordertype && orderby) {
			listPokemonOrdered = orderPokemonList(listPokemonOrdered, orderby, ordertype);
		}

		const orderString = orderby && ordertype ? `&orderby=${orderby}&ordertype=${ordertype}` : '';
		const { count, next, prev, dataList, maxPage, currentPage } = pagination(
			req,
			filterByIdSlice,
			listPokemonOrdered,
			offset,
			limit,
			`types/${id}`,
			orderString
		);

		res
			.status(200)
			.json({ count, next, prev, name: foundedType.dataValues.name, results: dataList });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

module.exports = {
	getTypes,
	// filterTypesApi,
	typeFilterById,
};
