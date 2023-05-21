const { default: axios } = require('axios');
const CustomError = require('../classes/CustomError');
const { POKE_API_URL, TYPE_SOURCE } = require('./pokeApiUrl');

const getTypesFromApi = async () => {
	try {
		let typesToDB = [];

		const response = await axios(`${POKE_API_URL}/${TYPE_SOURCE}`);
		const { results } = response.data;

		typesToDB = results.map((result) => {
			const id = result.url.split('/').at(-2);

			return {
				id,
				name: result.name,
			};
		});

		return typesToDB;
	} catch (error) {
		return { status: error.response.status };
	}
};

module.exports = {
	getTypesFromApi,
};
