const { register } = require('./user/register');
const { login } = require('./user/login');
const { logout } = require('./user/logout');

module.exports = {
	register,
	login,
	logout,
};
