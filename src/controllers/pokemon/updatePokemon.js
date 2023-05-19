const { Op } = require('sequelize');
const CustomError = require('../../classes/CustomError');
const { User, Pokemon } = require('../../db');
const { optionsUser } = require('../../utils/optionToFindPokemon');

const updatePokemon = async (req, res) => {
	try {
		const {
			id,
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

		if (!id) throw new CustomError(400, 'Please, send the pokemon id');

		if (typeof id !== 'number') throw new CustomError(400, 'Pokemon id should be a number');

		const userFound = await User.findByPk(userId);

		if (!userFound) throw new CustomError(400, 'User is not in data base');

		const pokemonFinded = await Pokemon.findByPk(id);

		if (!pokemonFinded) throw new CustomError(400, `Pokemon '${name}' is not in the data base`);

		await pokemonFinded.update(
			{
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
			},
			{
				where: {
					[Op.and]: [{ id: id }, { userId }],
				},
			}
		);

		await pokemonFinded.setTypes(types);

		const returnedPokemon = await Pokemon.findByPk(id, { ...optionsUser });

		res.status(201).json({ success: true, pokemon: returnedPokemon });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

module.exports = { updatePokemon };
