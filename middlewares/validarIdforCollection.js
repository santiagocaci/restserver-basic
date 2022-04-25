const { User, Product } = require("../models");

const idExistsInCollection = async (req, res, next) => {

  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case 'usuarios':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        })
      }
      break;
    case 'productos':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        })
      }
      break;

    default:
      return res.status(500).json({ msg: `${collection} no esta validado` });
  }
  req.model = model;

  next();
}

module.exports = {
  idExistsInCollection
}