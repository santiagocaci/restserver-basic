const Category = require('./category');
const Product = require('./product');
const Role = require('./role.js');
const Server = require('./server.js');
const User = require('./user.js');
const ChatMensajes = require('./chat-msg.js')

module.exports = {
  ChatMensajes,
  Category,
  Product,
  Role,
  server: Server,
  User,
}