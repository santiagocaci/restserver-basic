const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const validarJWT = async(request, response = response, next) => {
  const token = request.header('x-token');

  if (!token) {
    return response.status(401).json({
      msg: 'No hay token en la peticion',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPTIVATEKEY);
    const user = await User.findById(uid);
    
    if(!user){
      return response.status(401).json({
        msg: 'Token no valido - User does not exist in the DB'
      })
    }

    // Verifica si el uid tiene el status en true
    if( !user.status){
      return response.status(401).json({
        msg: 'Token no valido - User status: false'
      })
    }
    
    request.user= user;
    next();
  } catch (error) {
    // console.log(error);
    response.status(401).json({
      msg: 'Token no valido'
    });
  }
}
module.exports = {
  validarJWT,
}

