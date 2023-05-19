const CustomError = require('../../classes/CustomError');
const { User, Pokemon } = require('../../db');

const deletePokemon = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.userId;

		if (!id || !userId) throw new CustomError(400, 'Please, send the pokemon id and user id');

		const userFound = await User.findByPk(userId);

		if (!userFound) throw new CustomError(400, 'User is not in data base');

		const pokemonFinded = await Pokemon.findByPk(+id);

		if (!pokemonFinded) throw new CustomError(400, `Pokemon id '${id}' is not in the data base`);

		await pokemonFinded.destroy();

		res.status(200).json({ success: true });
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

module.exports = { deletePokemon };
