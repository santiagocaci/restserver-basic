const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields, validarJWT } = require("../middlewares");

const { login, googleSignIn, validationTokenController } = require("../controllers/auth.controllers");
const router = Router();

router.post('/login', [
  check('email', 'The email is required').isEmail(),
  check('password', 'The password is required').not().isEmpty(),
  validateFields
], login);


router.post('/google', [
  check('id_token', 'El id_token es necesario').not().isEmpty(),
  validateFields
], googleSignIn);

router.get('/', validarJWT, validationTokenController);

module.exports = router;

