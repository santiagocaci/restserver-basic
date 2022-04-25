const { response, request } = require("express");

const { Category } = require('../models');

// getCategories - paginado - total - populate
const getCategories = async (request = request, response = response) => {


  const { limit = 0, skip = 0 } = request.query;

  const [total, categories] = await Promise.all([
    Category.countDocuments({ status: true }),
    Category.find({ status: true })
      .populate({
        path: 'user',
        select: 'name'
      })
      .limit(limit)
      .skip(skip),

  ]);

  response.json({
    total,
    categories
  });


}

// getCategory - populate {}
const getCategoryById = async (request, response) => {
  const { id } = request.params;
  const category = await Category.findById(id)
    .populate({
      path: 'user',
      select: 'name'
    });
  response.json(
    category
  );
}

const createCategory = async (request, response) => {

  const name = request.body.name.toUpperCase();
  const categoriaDB = await Category.findOne({ name });
  if (categoriaDB) {
    return response.status(400).json({
      msg: `La categoria ${categoriaDB.name}, ya existe`
    })
  }

  // Generar la data a guardar
  const data = {
    name,
    user: request.user._id
  }

  const category = new Category(data);

  // Guardar en db
  await category.save();

  response.status(201).json(category);
}

// updateCategory
const updateCategoryById = async (request, response) => {

  const { id } = request.params;

  const { status, user, ...data } = request.body;

  data.name = data.name.toUpperCase();
  data.user = request.user._id;
  const categoryWithNewName = await Category.findByIdAndUpdate(id, data, { new: true });

  response.json(categoryWithNewName);
}

// deleteCategory - status: false
const deleteCategoryById = async (request, response) => {
  const { id } = request.params;
  const categoryDelete = await Category.findByIdAndUpdate(id, { status: false }, { new: true });
  response.json(
    categoryDelete
  );
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById
};