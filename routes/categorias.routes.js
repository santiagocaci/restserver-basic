const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT, validateFields, isAdminRole } = require("../middlewares");

const { createCategory, getCategories, getCategoryById, updateCategoryById, deleteCategoryById } = require("../controllers/categorias.controllers");
const { categoryById, nameCategoryExists } = require("../helpers/db_validators");


const router = Router();

// Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoria por id - publico
router.get('/:id', [
  check('id', 'No es un id de mongo').isMongoId(),
  check('id').custom(categoryById),
  validateFields
], getCategoryById);

// Crear una categoria - privada - cualquier persona con token valido
router.post('/', [
  validarJWT,
  check('name', 'Name is required').not().isEmpty(),
  validateFields
], createCategory);

// Actualiza un registro por id - privado - cualquiera con token valido
router.put('/:id', [
  validarJWT,
  check('name', 'Name is required').not().isEmpty(),
  check('id').custom(categoryById),
  check('name').custom(nameCategoryExists),
  validateFields
], updateCategoryById);

// Borrar una categoria - Admin
router.delete('/:id', [
  validarJWT,
  isAdminRole,
  check('id', 'No es un id de mongo').isMongoId(),
  check('id').custom(categoryById),
  validateFields
], deleteCategoryById);



module.exports = router;