const { default: mongoose } = require("mongoose");
const { User, Category, Product } = require('../models');

const allowedCollections = [
  'users',
  'categories',
  'products',
  'productsByCategory',
  'role'
]

const searchUsers = async (term = '', res) => {
  const isMongoId = mongoose.Types.ObjectId.isValid(term);
  if (isMongoId) {
    const user = await User.findById(term);
    res.json({
      results: (user) ? [user] : []
    });
  }

  // Esta expresion regular hace que el termino se insensible a mayusculas y minusculas
  const regex = new RegExp(term, 'i');

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }]
  });

  res.json({
    results: users
  })
}

const searchCatergories = async (term, res) => {
  const isMongoId = mongoose.Types.ObjectId.isValid(term);
  if (isMongoId) {
    const category = await Category.findById(term);
    res.json({
      results: (category) ? [category] : []
    });
  }

  const regex = new RegExp(term, 'i');

  const categories = await Category.find({ name: regex, status: true });

  res.json({
    results: categories
  });
}

const searchProducts = async (term, res) => {
  const isMongoId = mongoose.Types.ObjectId.isValid(term);
  if (isMongoId) {
    const product = await Product.findById(term);
    res.json({
      results: (product) ? [product] : []
    });
  }

  const regex = new RegExp(term, 'i');

  const products = await Product.find({ name: regex, status: true });

  res.json({
    results: products
  });
}

const searchProductsByCategory = async (term, res) => {

  const isMongoId = mongoose.Types.ObjectId.isValid(term);
  if (isMongoId) {
    const products = await Product.find({ category: mongoose.Types.ObjectId(term) }).populate('category', 'name');
    res.json({
      results: (products) ? [products] : [],
    })
  }

  const regex = new RegExp(term, 'i');

  const categories = await Category.find({ name: regex, status: true });


  const products = await Product.find({
    $or: [...categories.map(category => ({
      category: category._id
    }))],
    $and: [{ status: true }]
  }).populate('category', 'name');

  res.json({
    products
  });
}

const search = (req, res) => {

  const { colection, term } = req.params;

  if (!allowedCollections.includes(colection)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${allowedCollections}`
    })
  }

  switch (colection) {
    case 'users':
      searchUsers(term, res);
      break;

    case 'categories':
      searchCatergories(term, res);
      break;

    case 'products':
      searchProducts(term, res);
      break;
    case 'productsByCategory':
      searchProductsByCategory(term, res);
      break;

    default:
      res.status(500).json({
        msg: 'Mala busqueda'
      })
      break;
  }

}

module.exports = {
  search,
}