const dbValidators = require('./db_validators');
const generarJWT = require('./generar-jwt');
const googleVerifiy = require('./google-verify');
const uploadFile = require('./upload-file');

module.exports = {
  ...dbValidators,
  ...generarJWT,
  ...googleVerifiy,
  ...uploadFile
}