const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validateFields, isAdminRole } = require('../middlewares');

const { createProduct, getProducts, getProductById, updateProductById, deleteProductById } = require('../controllers/products.controllers');
const { categoryById, productExistsById, nameProductExists } = require('../helpers/db_validators');

const router = Router();

// Crear un producto - privado - cualquier persona con token valido
router.post('/', [
  validarJWT,
  check('name', 'Name is required').not().isEmpty(),
  check('category', 'No es un MongoID').isMongoId(),
  check('category').custom(categoryById),
  validateFields
], createProduct);

// Obtiene todos los productos disponibles y el total
router.get('/', getProducts);

// Obtiene un producto por id
router.get('/:id', [
  check('id', 'El id no debe de estar vacio').not().isEmpty(),
  check('id', 'No es un id de mongo').isMongoId(),
  check('id').custom(productExistsById),
  validateFields
], getProductById)

// Actualizar productos por id - privado - token valido
router.put('/:id',[
  validarJWT,
  check('id', 'El id no debe de estar vacio').not().isEmpty(),
  check('id', 'No es un id de mongo').isMongoId(),
  check('id').custom(productExistsById),
  // ¿Deberia poder actualizarse la categoria del producto?
  // check('category', 'La category debe exisistir').not().isEmpty(),
  // check('category', 'la categoria no es un id de mongo').isMongoId(),
  check('name').custom(nameProductExists),
  validateFields
],updateProductById);

router.delete('/:id',[
  validarJWT,
  check('id', 'El id no debe de estar vacio').not().isEmpty(),
  check('id', 'No es un id de mongo').isMongoId(),

  check('id').custom(productExistsById),
  isAdminRole,
  validateFields
],deleteProductById);

module.exports = router;