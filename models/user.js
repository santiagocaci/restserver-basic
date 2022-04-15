// {
//   name: 'asd',
//   email: 'asd@',
//   password: '2314235',
//   img: 'url',
//   status: true,
//   google: true,
// }


const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    emun: ['ADMIN_ROLE', 'USER_ROLE'],
  },
  status: {
    type: Boolean,
    default: true,
  },
  // Verifica si el usuario fue creado por google
  google: {
    type: Boolean,
    default: false,
  }
});


// Extrae la version y el password, Tiene que se una funcion normal
UserSchema.methods.toJSON = function(){
  const {__v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
}

module.exports = model('User', UserSchema);