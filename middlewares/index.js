const validarJWT = require('../middlewares/validar-jwt');
const validateFields = require('../middlewares/validateFields');
const validaRoles = require('../middlewares/validar-roles');
const validarFile = require('../middlewares/validarFile');


module.exports = {
  ...validaRoles,
  ...validateFields,
  ...validarJWT,
  ...validarFile
}