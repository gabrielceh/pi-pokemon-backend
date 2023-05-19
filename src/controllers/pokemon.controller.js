const { Op } = require('sequelize');
const path = require('path');

const CustomError = require('../classes/CustomError');
const readFiles = require('../utils/readFiles');

const { Pokemon, Pokemon_Api, Types, User } = require('../db');

const { getPokemon } = require('./pokemon/getPokemon');
const { getPokemonById } = require('./pokemon/getPokemonById');
const { getUsersPokemon } = require('./pokemon/getUsersPokemon');
const { getPokemonByUser } = require('./pokemon/getPokemonByUser');
const { addPokemon } = require('./pokemon/addPokemon');
const { updatePokemon } = require('./pokemon/updatePokemon');
const { deletePokemon } = require('./pokemon/deletePokemon');
const { getApiPokemon } = require('./pokemon/getApiPokemon');

const addPokemonAdmin = async (req, res) => {
	/**Añade los pokemon que estan en el archivo PokDataBase a la base de datos */
	try {
		const allPokemon = await Pokemon_Api.findAll();

		if (!allPokemon.length < 1000) {
			const filePath = path.join(__dirname, '..', 'data', 'PokDataBase.json');
			// const filePath = path.join(__dirname, '..', 'data', 'PokDataBase.json');
			readFiles(filePath)
				.then(async (data) => {
					for (let pokemon of data) {
						const pok = {
							id: pokemon.id,
							name: pokemon.name,
							image: pokemon.image,
							hp: pokemon.hp,
							attack: pokemon.attack,
							defense: pokemon.defense,
							special_attack: pokemon['special-attack'],
							special_defense: pokemon['special-defense'],
							speed: pokemon.speed,
							weight: pokemon.weight,
							height: pokemon.height,
						};
						const types = pokemon.types.map((item, index) => {
							return {
								id: item,
								order: index,
							};
						});
						const newPokemon = await Pokemon_Api.create(pok);

						for (let type of types) {
							await newPokemon.addType(type.id); // nos aseguramos que el orden en que se guardan los datos sea el correcto
						}
					}
					res.status(200).json(data);
				})
				.catch((error) => {
					console.log(error);
					const status = error.status;
					return res.status(status).json({ error: error.message });
				});
		} else {
			res.status(200).json(allPokemon);
		}
	} catch (error) {
		const status = error.status;
		return res.status(status).json({ error: error.message });
	}
};

module.exports = {
	addPokemon,
	addPokemonAdmin,
	getApiPokemon,
	getPokemon,
	getPokemonById,
	getUsersPokemon,
	getPokemonByUser,
	updatePokemon,
	deletePokemon,
};
