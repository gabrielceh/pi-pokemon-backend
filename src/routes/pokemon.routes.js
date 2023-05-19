const router = require('express').Router();

const {
	addPokemon,
	addPokemonAdmin,
	getPokemon,
	getPokemonById,
	getUsersPokemon,
	getPokemonByUser,
	updatePokemon,
	deletePokemon,
	getApiPokemon,
} = require('../controllers/pokemon.controller');
const { validatePokemonData, validateTypes } = require('../middleware/validatePokemonData');
const { validationOrder } = require('../middleware/validationOrder');
const { validationPagination } = require('../middleware/validationPagination');
const verifyAuthToken = require('../middleware/verifyAuthToken');

/** GET			"/"					Devuelve los pokemon, paginados y filtrados si se indica
 * GET 			"/:id"				Devuelve el pokemon por id ya sea del usuario o los originales
 * POST 		"/"					Añade un nuevo pokemon
 * PUT			"/"					Actualiza un pokemon
 * DELETE		"/:id"				Elimina un pokemon
 * GET 			"/user/:userId"		Trae todos los pokemon del usuario
 */

router.get('/', validationPagination, validationOrder, getPokemon);
router.get('/:id', getPokemonById);

router.get('/users/pokemon', validationPagination, validationOrder, getUsersPokemon);
router.get('/api/pokemon', validationPagination, validationOrder, getApiPokemon);

router.post('/', verifyAuthToken, validatePokemonData, validateTypes, addPokemon);
router.put('/', verifyAuthToken, validatePokemonData, validateTypes, updatePokemon);
router.delete('/:id', verifyAuthToken, deletePokemon);

router.get('/user/:userId', validationPagination, getPokemonByUser);

router.get('/admin/add-pokemon', addPokemonAdmin);

module.exports = router;
