const { response, request } = require('express');
const bcryptjs = require('bcrypt');

const User = require('../models/user');

const userGet = async (req, res = response) => {
  // const query = req.query;

  const { limit = 0, skip = 0 } = req.query;

  const [total, users] = await Promise.all([
    User.countDocuments({ status: true }),
    User.find({ status: true })
      .limit(limit)
      .skip(skip),
  ]);

  res.json({
    total,
    users
  });
}

const userGetByName = async (req, res) => {
  const { name } = req.params;

  const user = await User.findOne({ name: new RegExp('^' + name + '$', 'i') });

  if (!user) {
    return res.status(400).json({
      msg: `User ${name} no encontrado`
    });
  }

  res.json(user);
}

const userPost = async (req, res = response) => {


  // Es importante que el body deba tener una limpieza
  const { name, password, email, role } = req.body;
  const user = new User({ name, password, email, role });

  // Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Graba el registro del usuario 
  await user.save();

  res.json(user);
}

const userPut = async (req, res = response) => {

  const id = req.params.id;
  const { _id, password, google, email, ...resto } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, resto);

  res.json({
    msg: 'put API - controlador',
    user,
  });
}

const userPatch = (req, res = response) => {
  res.json({
    msg: 'patch API - controlador'
  });
}

const userDelete = async (req = request, res = response) => {
  const { id } = req.params;

  // Borrarlo fisicamente
  // const user = await User.findByIdAndDelete(id);

  const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });
  const userAutenticado = req.user;

  res.json({ user });
}

module.exports = {
  userGet,
  userPost,
  userPut,
  userPatch,
  userDelete,
  userGetByName,
}