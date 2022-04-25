const Category = require('./category');
const Product = require('./product');
const Role = require('./role.js');
const Server = require('./server.js');
const User = require('./user.js');

module.exports = {
  Category,
  Product,
  Role,
  server: Server,
  User,
}