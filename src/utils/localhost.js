require('dotenv').config();
const url = require('url');
const { NODE_ENV } = process.env;

const getMyHost = (req) => {
	const baseURL =
		NODE_ENV === 'production' ? `https://${req.headers.host}` : `http://${req.headers.host}`;

	const myUrl = new URL(req.url, baseURL);

	return myUrl;
};

module.exports = {
	getMyHost,
};
