const mongoose = require('mongoose');

const Role = require('../models/role');
const User = require('../models/user');


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

module.exports = {
  isValidRole,
  emailExists,
  userExistsById,
}