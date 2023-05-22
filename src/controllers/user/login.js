const { User } = require('../../db');
const bcrypt = require('bcrypt');
const CustomError = require('../../classes/CustomError');
const { generateToken } = require('../../utils/generateToken');
const { Op } = require('sequelize');

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({
			where: { [Op.or]: [{ email: email.toLowerCase() }, { userName: email }] },
		});

		if (!user) {
			throw new CustomError(400, 'Email or Password not valid');
		}

		const comparePass = await bcrypt.compare(password, user.password);

		if (!comparePass) throw new CustomError(400, 'Email or Password not valid');

		const { email: emailDB, userId, userName } = user.dataValues;

		const { token, expireIn } = generateToken(userId, emailDB, userName, res);

		return res.status(200).json({
			access: true,
			user: { email: emailDB, userId, userName },
			auth_token: {
				token,
				expireIn,
			},
			error: null,
		});
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

module.exports = { login };
