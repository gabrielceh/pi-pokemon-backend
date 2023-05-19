const { validateLogin, validateRegister } = require('../middleware/validateLogin');
const { register, login, logout } = require('../controllers/user.controller');

const router = require('express').Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/logout', logout);

module.exports = router;
