const { default: axios } = require('axios');
const CustomError = require('../classes/CustomError');
const { POKE_API_URL, TYPE_SOURCE } = require('./pokeApiUrl');

const getTypesFromApi = async () => {
	let typesToDB = [];

	const response = await axios(`${POKE_API_URL}/${TYPE_SOURCE}`);
	if (response.status >= 400) {
		throw new CustomError(response.status, response.statusText);
	}
	const { results } = await response.json();

	typesToDB = results.map((result) => {
		const id = result.url.split('/').at(-2);

		return {
			id,
			name: result.name,
		};
	});

	return typesToDB;
};

module.exports = {
	getTypesFromApi,
};
