const { Op } = require('sequelize');
const CustomError = require('../../classes/CustomError');
const { User, Pokemon, Pokemon_Api } = require('../../db');
const { optionsUser } = require('../../utils/optionToFindPokemon');
const { POKE_API_URL, POKEMON_SOURCE } = require('../../utils/pokeApiUrl');
const { default: axios } = require('axios');

const addPokemon = async (req, res) => {
	try {
		const {
			name,
			image,
			hp,
			attack,
			defense,
			special_attack,
			special_defense,
			speed,
			weight,
			height,
			types,
		} = req.body;

		const userId = req.userId;

		const userFound = await User.findByPk(userId);

		if (!userFound) throw new CustomError(400, 'User is not in data base');

		const pokemonFinded = await Pokemon.findOne({ where: { name: name.toLowerCase() } });

		await axios.get(`${POKE_API_URL}/${POKEMON_SOURCE}/${name.toLowerCase()}`).then((data) => {
			throw new CustomError(400, `Pokemon '${name}' is already in the data base`);
		});

		if (pokemonFinded) throw new CustomError(400, `Pokemon '${name}' is already in the data base`);

		const newPokemon = await userFound.createPokemon({
			name: name.toLowerCase(),
			image: image || null,
			hp: +hp,
			attack: +attack,
			defense: +defense,
			special_attack: +special_attack,
			special_defense: +special_defense,
			speed: +speed,
			height: height || null,
			weight: weight || null,
			userId,
		});

		for (let type of types) {
			await newPokemon.addType(type); // nos aseguramos que el orden en que se guardan los datos sea el correcto
		}

		const pokemonReturned = await Pokemon.findOne({
			where: {
				[Op.and]: [{ name: name.toLowerCase() }, { userId }],
			},
			...optionsUser,
		});

		res.status(201).json({ success: true, new_pokemon: pokemonReturned });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

module.exports = { addPokemon };
