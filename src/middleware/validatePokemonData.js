const CustomError = require('../classes/CustomError');
const { Types } = require('../db');

const validatePokemonData = (req, res, next) => {
	try {
		const {
			name,
			hp,
			attack,
			defense,
			special_attack,
			special_defense,
			speed,
			types,
			height,
			weight,
		} = req.body;

		if (
			!name ||
			hp === null ||
			hp === undefined ||
			attack === null ||
			attack === undefined ||
			defense === null ||
			defense === undefined ||
			special_attack === null ||
			special_attack === undefined ||
			special_defense === null ||
			special_defense === undefined ||
			speed === null ||
			speed === undefined
		) {
			throw new CustomError(
				400,
				'The following data is required: name, hp, attack, defense, special attack, special defense, speed, types'
			);
		}

		if (
			typeof hp !== 'number' ||
			typeof attack !== 'number' ||
			typeof defense !== 'number' ||
			typeof special_attack !== 'number' ||
			typeof special_defense !== 'number' ||
			typeof speed !== 'number'
		) {
			throw new CustomError(
				400,
				'hp, attack, defense, special_attack, special_defense should be numbers'
			);
		}

		if (!Array.isArray(types)) {
			throw new CustomError(400, 'Types should be an array');
		}

		if ((height && isNaN(height)) || (weight && isNaN(weight))) {
			throw new CustomError(400, 'height or weight should be numbers');
		}

		next();
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

const validateTypes = async (req, res, next) => {
	try {
		const { types } = req.body;
		if (!types.length) {
			throw new CustomError(400, 'Send at least one type in the array');
		}

		if (types.length > 2) {
			throw new CustomError(400, 'Max. two types');
		}

		for (let type of types) {
			if (typeof type !== 'number') throw new CustomError(400, 'Elements of types must be numbers');

			const foundedType = await Types.findByPk(+type);

			if (!foundedType) {
				throw new CustomError(404, `The type id ${type} is not in the data base`);
			}
		}

		next();
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

module.exports = { validatePokemonData, validateTypes };
