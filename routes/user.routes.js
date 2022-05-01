const { Router } = require('express');
const { check } = require('express-validator');


// const { validarJWT } = require('../middlewares/validar-jwt');
// const { validateFields } = require('../middlewares/validateFields');
// const { isAdminRole, tieneRole } = require('../middlewares/validar-roles');
const {
  validarJWT,
  validateFields,
  isAdminRole,
  tieneRole,
} = require('../middlewares')


const { isValidRole, emailExists, userExistsById } = require('../helpers/db_validators');

const { userGet,
  userPut,
  userPost,
  userDelete,
  userPatch,
  userGetByName } = require('../controllers/user.controller');
const router = Router();


router.get('/', [
  check('limit', 'The value is not a number').isInt(),
  check('skip', 'The value is not a number').isInt(),
  validateFields
], userGet);

router.get('/:name', [
  check('name', 'The value is not a string').isString(),
  check('name', 'The value is not a string').not().isEmpty(),
  validateFields
], userGetByName);

router.post('/', [
  // este es un array de middleware

  check('name', 'Name is required').not().isEmpty(),
  check('password', 'Password is required and must be six characters or more').isLength({ min: 6 }).not().isEmpty(),
  check('email', 'The email entered is not valid').isEmail(),
  check('email').custom(emailExists),
  // check('role', 'Not a valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
  check('role').custom(isValidRole),
  validateFields
], userPost);

router.put('/:id', [
  check('id', 'Invalid MongoId').isMongoId(),
  check('id').custom(userExistsById),
  check('role').custom(isValidRole),
  validateFields
], userPut);

router.patch('/', userPatch);

router.delete('/:id', [
  validarJWT,
  isAdminRole,
  tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE'),
  check('id', 'Invalid MongoId').isMongoId(),
  check('id').custom(userExistsById),
  validateFields
], userDelete);

module.exports = router;