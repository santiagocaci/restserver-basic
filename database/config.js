const mongoose = require('mongoose');

const dbConection = async() =>{
  try {
    await mongoose.connect( process.env.MONGODB_CNN,{
      // Ya no son necesarios estas lines de codigo despues de la v6
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
    });
    console.log('Base de datos online');
  } catch (err) {
    console.log(err);
    throw new Error('Error a la hora de inicializar la base de datos');
  }
}

module.exports = {
  dbConection,
}