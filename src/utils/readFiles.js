const fs = require('fs');

function readFiles(route) {
	return new Promise((resolve, reject) => {
		fs.readFile(route, 'utf-8', (error, content) => {
			if (error) {
				reject({ status: 500, message: error.message });
			} else {
				const data = JSON.parse(content);
				resolve(data);
			}
		});
	});
}

module.exports = readFiles;
