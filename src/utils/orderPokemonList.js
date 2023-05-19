const orderPokemonList = (data = [], orderby, ordertype) => {
	const sortedPokemon = data.sort((a, b) => {
		let attA = a.dataValues ? a.dataValues[orderby] : a[orderby];
		let attB = b.dataValues ? b.dataValues[orderby] : b[orderby];

		if (ordertype === 'asc') {
			if (attA > attB) return 1;
			if (attA < attB) return -1;
		}
		if (ordertype === 'desc') {
			if (attA > attB) return -1;
			if (attA < attB) return 1;
		}
	});
	return sortedPokemon;
};

module.exports = { orderPokemonList };
