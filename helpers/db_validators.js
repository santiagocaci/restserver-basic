const mongoose = require('mongoose');

const { Category, Role, User, Product } = require('../models');


const isValidRole = async (role = '') => {
  const existRole = await Role.findOne({ role });
  if (!existRole) {
    throw new Error(`The ${role} is not registered in the database`);
  }
}

const emailExists = async (email = '') => {
  const validator = await User.findOne({ email });
  if (validator) {
    throw new Error(`The ${email} is registered in the database`);
  }
}

const userExistsById = async (id) => {

  if (mongoose.Types.ObjectId.isValid(id)) {
    const existId = await User.findById(id);
    if (!existId) {
      throw new Error(`El id  ${id}  no existe en la BD`);
    }
  } else {
    throw new Error(`El id ${id} no es válido`);
  }
}

const categoryById = async (id) => {

  if (mongoose.Types.ObjectId.isValid(id)) {
    const validation = await Category.findById(id);
    if (!validation) {
      throw new Error(`El id ${id} no existe en la BD`);
    }
  } else {
    throw new Error(`El id ${id} no es valido`);
  }
}

const nameCategoryExists = async (name) => {
  const nameCapitalize = name.toUpperCase();
  const validator = await Category.findOne({ name: nameCapitalize });
  if (validator) {
    throw new Error(`The ${nameCapitalize} is registered in the database`);
  }
}

const productExistsById = async (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const validation = await Product.findById(id);
    if (!validation) {
      throw new Error(`El id ${id} no existe en la BD`);
    }
  } else {
    throw new Error(`El id ${id} no es valido`);
  }
}

const nameProductExists = async (name) => {

  const nameCapitalize = name.toUpperCase();
  const validation = await Product.findOne({ name: nameCapitalize });
  if (validation) {
    throw new Error(`The ${nameCapitalize} is registered in the database`);
  }

}

const allowedCollections = (collection = '', collections = []) => {

  const include = collections.includes(collection);
  if (!include) {
    throw new Error(`La coleccion ${collection} no es permitida - ${collections} `);
  }
  return true;
}

module.exports = {
  isValidRole,
  emailExists,
  userExistsById,
  categoryById,
  nameCategoryExists,
  productExistsById,
  nameProductExists,
  allowedCollections
}