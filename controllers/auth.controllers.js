const { response, request } = require("express");
const bcryptjs = require('bcrypt');

const User = require("../models/user");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");
// const { DefaultTransporter } = require("google-auth-library");


const login = async (req = request, res = response) => {

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

const googleSignIn = async (request, response) => {
  const { id_token } = request.body;

  try {

    const {name, picture: img, email} = await googleVerify( id_token);
    // Puede que el user exista o no y que es la primera vez
    let user = await User.findOne({email});
    if (!user) {
      const data = {
        name,
        email,
        password: ':P',
        img,
        google: true, 
      }
      user = new User(data);
      await user.save();
    }

    if(!user.status){
      return response.status(401).json({
        msg: 'Hable con el admin, usuario bloqueado'
      });
    }

    const token = await generarJWT(user.id);

    // console.log(name, img, email);
    response.json({
      user,
      token
    });
    
  } catch (error) {
    response.status(400).json({
      ok: false,
      msg: 'El token no se pudo verificar'
    });
  }
}

module.exports = {
  login,
  googleSignIn
}