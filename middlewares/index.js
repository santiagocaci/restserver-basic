const validarJWT = require('../middlewares/validar-jwt');
const validarCampos = require('../middlewares/validateFields');
const validaRoles = require('../middlewares/validar-roles');

module.exports = {
  ...validaRoles,
  ...validarCampos,
  ...validarJWT
}