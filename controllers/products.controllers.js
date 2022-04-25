
const { Product } = require('../models');
const user = require('../models/user');


const createProduct = async (req, resp) => {

  const name = req.body.name.toUpperCase();
  const checkName = await Product.findOne({ name: name }, 'name');
  if (checkName) {
    return resp.status(400).json({
      msg: `El producto ${checkName.name}, ya existe`
    });
  }
  const data = {
    name,
    user: req.user._id,
    category: req.body.category
  }

  const product = new Product(data);

  await product.save();

  resp.status(201).json(product);
}

const getProducts = async (req, resp) => {

  const { limit = 0, skip = 0 } = req.query;
  const [total, products] = await Promise.all([
    Product.countDocuments({ status: true }),
    Product.find({ status: true })
      .populate({
        path: 'user',
        select: 'name'
      })
      .populate({
        path: 'category',
        select: 'name'
      })
      .limit(Number(limit))
      .skip(Number(skip))
  ]);
  resp.json({
    total,
    products,
  });
}

const getProductById = async (req, resp) => {

  const { id } = req.params;
  const product = await Product.findById(id)
    .populate({
      path: 'user',
      select: 'name'
    })
    .populate({
      path: 'category',
      select: 'name'
    });

  resp.json(product);
}

const updateProductById = async (req, resp) => {
  const { id } = req.params;
  const { _id, status, available, ...resto } = req.body;
  if (resto.name) {
    resto.name = resto.name.toUpperCase();
  }
  resto.user = req.user.id;
  const productUpdate = await Product.findByIdAndUpdate(id, resto, { new: true });
  resp.json(productUpdate);
}

const deleteProductById = async (req, resp) => {
  const { id } = req.params;
  const productDelete = await Product.findByIdAndUpdate(id, { status: false }, { new: true });
  resp.json(productDelete);
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById
}