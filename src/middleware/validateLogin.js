const CustomError = require('../classes/CustomError');
const { EMAIL_REGEX, PASSWORD_REGEX } = require('../utils/regex');

const validateRegister = (req, res, next) => {
	try {
		const { email, password, userName } = req.body;

		if (!email || !password || !userName) {
			throw new CustomError(400, 'Please, send email, password and userName');
		}

		if (!EMAIL_REGEX.test(email)) {
			throw new CustomError(400, 'Email is not valid');
		}

		if (!PASSWORD_REGEX.test(password)) {
			throw new CustomError(
				400,
				`The password must contain:\n* from 8 to 16 digits.\n* Must have at least one capital letter.\n* Must have at least one number.\n* Must have at least one of the following characters: *_-.#$`
			);
		}

		next();
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

const validateLogin = (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new CustomError(400, 'Please, send email and password');
		}

		// if (!EMAIL_REGEX.test(email)) {
		// 	throw new CustomError(400, 'Email or Password not valid');
		// }

		next();
	} catch (error) {
		const status = error.status || 500;
		res.status(status).json({ error: error.message });
	}
};

module.exports = { validateLogin, validateRegister };
