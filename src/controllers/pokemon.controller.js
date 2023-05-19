const { getPokemon } = require('./pokemon/getPokemon');
const { getPokemonById } = require('./pokemon/getPokemonById');
const { getUsersPokemon } = require('./pokemon/getUsersPokemon');
const { getPokemonByUser } = require('./pokemon/getPokemonByUser');
const { addPokemon } = require('./pokemon/addPokemon');
const { updatePokemon } = require('./pokemon/updatePokemon');
const { deletePokemon } = require('./pokemon/deletePokemon');
const { getApiPokemon } = require('./pokemon/getApiPokemon');

module.exports = {
	addPokemon,
	getApiPokemon,
	getPokemon,
	getPokemonById,
	getUsersPokemon,
	getPokemonByUser,
	updatePokemon,
	deletePokemon,
};
