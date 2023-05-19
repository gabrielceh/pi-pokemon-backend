const CustomError = require('../classes/CustomError');

const validationPagination = (req, res, next) => {
	try {
		let { offset, limit } = req.query;

		if ((offset && !limit) || (!offset && limit)) {
			throw new CustomError(404, 'Please, offset and limit together');
		}

		if ((isNaN(offset) && offset !== undefined) || (isNaN(limit) && limit !== undefined)) {
			throw new CustomError(404, 'Please, offset and limit must to be numbers');
		}

		next();
	} catch (error) {
		const status = error.status || 500;
		return res.status(status).json({ error: error.message });
	}
};

module.exports = { validationPagination };
