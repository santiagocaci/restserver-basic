const jwt = require("jsonwebtoken")



const generarJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(payload, process.env.SECRETORPTIVATEKEY, {
      expiresIn: '2d'
    }, (err, token) => {
      if (err) {
        console.log(err);
        reject('NO se pudo generar el token');
      } else {
        resolve(token);
      }
    });
  });
}

module.exports = {
  generarJWT
}