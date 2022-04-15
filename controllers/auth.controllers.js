const { response } = require("express");
const bcryptjs = require('bcrypt');

const User = require("../models/user");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {

  const { email, password } = req.body;
  try {

    // Verificar si el email existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - email'
      });
    }
    // SI el user esta activo
    if (!user.status) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - status: false'
      });
    }

    //Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password'
      });
    }

    // Generasr el JWT
    const token = await generarJWT(user.id);

    res.json({
      user, 
      token
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: 'Hable con el admin perro'
    });
  }

}

module.exports = {
  login
}