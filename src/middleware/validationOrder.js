const CustomError = require('../classes/CustomError');
const { orderBy, orderTypes } = require('../utils/orderValues');

const validationOrder = (req, res, next) => {
	try {
		let { orderby, ordertype } = req.query;

		if ((orderby && !ordertype) || (ordertype && !orderby)) {
			throw new CustomError(404, 'Please, send orderby and ordertype together');
		}

		if (
			(orderby && orderBy.hasOwnProperty(orderby) === false) ||
			(ordertype && orderTypes.hasOwnProperty(ordertype) === false)
		) {
			throw new CustomError(
				404,
				'orderby must to be "name or attack" and ordertype  must to be "asc or desc'
			);
		}

		next();
	} catch (error) {
		const status = error.status || 500;
		return res.status(status).json({ error: error.message });
	}
};

module.exports = { validationOrder };
