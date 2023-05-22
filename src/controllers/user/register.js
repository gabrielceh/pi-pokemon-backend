const { Op } = require('sequelize');
const CustomError = require('../../classes/CustomError');
const { User } = require('../../db');

const register = async (req, res) => {
	try {
		const { email, password, userName } = req.body;

		const emailFinded = await User.findOne({
			where: {
				[Op.or]: [{ email: email.toLowerCase() }, { userName: userName }],
			},
		});

		if (emailFinded) {
			throw new CustomError(400, 'Email or User name is already in the data base');
		}

		const user = await User.create({ email: email.toLowerCase(), password, userName });

		const { email: emailDB, userId } = user.dataValues;

		res.status(200).json({
			access: true,
			user: { email: emailDB, userId },
			error: null,
		});
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

module.exports = { register };
