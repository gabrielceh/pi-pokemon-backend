const getPokemonSlice = (data = [], offset = 0, limit = 12) => {
	/**Funcion para el paginado de los pokemon de la base de datos */
	const dataSlice = data.slice(offset, offset + limit);
	return dataSlice;
};

module.exports = { getPokemonSlice };
