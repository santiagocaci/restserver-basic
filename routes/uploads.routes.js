const { Router } = require("express");
const { check } = require("express-validator");

const { loadFile, updateImage, showImage, updateImageCloudinary } = require("../controllers/uploads");
const { allowedCollections } = require("../helpers");
const { validateFields, validarFile } = require("../middlewares");
const { idExistsInCollection } = require("../middlewares/validarIdforCollection");

const router = Router();

router.post('/', validarFile, loadFile);

router.put('/:collection/:id', [
  validarFile,
  check('id', 'El id tiene que ser de mongo').isMongoId(),
  check('collection').custom(c => allowedCollections(c, ['usuarios', 'productos'])),
  check('file', 'El archivo no esta subido').isEmpty(),
  idExistsInCollection,
  validateFields
], updateImageCloudinary);

// Esta ruta es para cuando queres una imagen en un localhost
// router.put('/:collection/:id', [
//   validarFile,
//   check('id', 'El id tiene que ser de mongo').isMongoId(),
//   check('collection').custom(c => allowedCollections(c, ['usuarios', 'productos'])),
//   check('file', 'El archivo no esta subido').isEmpty(),
//   idExistsInCollection,
//   validateFields
// ], updateImage);


router.get('/:collection/:id', [
  check('id', 'El id tiene que ser de mongo').isMongoId(),
  check('collection').custom(c => allowedCollections(c, ['usuarios', 'productos'])),
  idExistsInCollection,
  validateFields
], showImage);

module.exports = router;