const { response, request } = require('express');
const bcryptjs = require('bcrypt');

const User = require('../models/user');

const userGet = async (req, res = response) => {
  // const query = req.query;

  const { limit = 0, skip = 0 } = req.query;
  // const users = await User.find({ status: true })
  //   .limit(limit)
  //   .skip(skip);

  // const total = await User.countDocuments({ status: true });

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

const userPost = async (req, res = response) => {



  // Es importante que el body deba tener una limpieza
  const { name, password, email, role } = req.body;
  const user = new User({ name, password, email, role });

  // // Verificar si el correo existe
  // const existEmail = await User.findOne({ email });
  // if (existEmail) {
  //   return res.status(400).json({
  //     msg: 'The email is already registered'
  //   })
  // }

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

const userDelete = async(req = request, res = response) => {
  const {id} = req.params;

  // Borrarlo fisicamente
  // const user = await User.findByIdAndDelete(id);

  const user = await User.findByIdAndUpdate(id, {status: false});
  const userAutenticado = req.user;

  res.json({user});
}

module.exports = {
  userGet,
  userPost,
  userPut,
  userPatch,
  userDelete,
}