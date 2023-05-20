const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[*_\-.#$])[A-Za-z\d*_\-.#$]{8,16}$/;
const URL_REGEX =
	/^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
const NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_\-]*[a-zA-Z0-9]$/;

module.exports = { EMAIL_REGEX, PASSWORD_REGEX, URL_REGEX, NAME_REGEX };
