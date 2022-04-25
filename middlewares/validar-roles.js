
const isAdminRole = (req, resp, next) => {

  if (!req.user) {
    return resp.status(500).json({
      msg: 'Se quiere verificar el role sin validar el token primero'
    });
  }
  const { role, name } = req.user;
  if (role !== 'ADMIN_ROLE') {
    return resp.status(401).json({
      msg: `${name} no es administrador - NO puede hacer esto`
    });
  }
  next();
}

// Operador Rest ... todo lo que mande va a convertirse en roles
const tieneRole = (...roles) => {

  // Tiene que retornar una funcion para que se ejecute
  return (req, resp, next) => {

    if (!req.user) {
      return resp.status(500).json({
        msg: 'Se quiere verificar el role sin validar el token primero'
      });
    }
    if (!roles.includes(req.user.role)) {
      return resp.status(401).json({
        msg: `El servicio requiere uno de estos roles ${roles}`
      });
    }

    next();
  }
}

module.exports = {
  isAdminRole,
  tieneRole,
}