const fs = require('fs');
const path = require('path');
const CustomError = require('../classes/CustomError');

const URL_BASE = 'https://pokeapi.co/api/v2';

async function getAllPokemon() {
	try {
		let nextUrl = `${URL_BASE}/pokemon/?offset=0&limit=100`;
		const pokemonList = [];
		// while (nextUrl) {
		const response = await fetch(nextUrl);
		const data = await response.json();
		pokemonList.push(...data.results);
		// nextUrl = data.next;
		// }
		return pokemonList;
	} catch (error) {
		console.log(error);
	}
}

async function getPokemonData(pokemonName) {
	const response = await fetch(`${URL_BASE}/pokemon/${pokemonName}`);
	const data = await response.json();
	let stats = {};
	for (let stat of data.stats) {
		stats[stat.stat.name] = stat.base_stat;
	}

	// const typesId = data.types.map((pokType) => {
	// 	let id = pokType.type.url.split('/').at(-2);
	// 	return +id;
	// });

	let types = [];

	for (let type of data.types) {
		let id = type.type.url.split('/').at(-2);
		types.push(+id);
	}

	const pokemon = {
		id: data.id,
		name: data.name,
		image: data.sprites.other['official-artwork'].front_default,
		...stats,
		weight: data.weight,
		height: data.height,
		types: types,
	};
	console.log('add:' + pokemon.name, 'types:', types);

	return pokemon;
}

const addPokemonToDataBase = async () => {
	try {
		const allPokemon = await getAllPokemon();
		const pokemonDataList = await Promise.all(
			allPokemon.map((pokemon) => getPokemonData(pokemon.name))
		);

		const filePath = path.join(__dirname, '..', 'data', 'pokemonList.json');

		const pokemonToSave = JSON.stringify(pokemonDataList);

		fs.writeFile(filePath, pokemonToSave, (err) => {
			if (err) {
				throw new Error(err);
			} else {
				console.log('File create and saved');
			}
		});
	} catch (error) {
		console.log(error);
	}
};

addPokemonToDataBase();
