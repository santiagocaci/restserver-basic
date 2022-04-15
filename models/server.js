const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config.js');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = '/api/usuarios';
    this.authPath = '/api/auth'

    // coenctar a la base de datos
    this.connectDataBase();

    // Middlewares son funciones que añaden otra funcionalidad al webserver
    this.middlewares();

    // Rutas de mi apps
    this.routes();
  }

  async connectDataBase() {
    await dbConection();
  }

  middlewares() {

    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static('public'));
  }

  routes() {
    // Los middlewares empiezan con .use
    this.app.use(this.usuariosPath, require('../routes/user.routes.js'));
    this.app.use(this.authPath, require('../routes/auth.routes.js'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto:', this.port);
    });
  }
}

module.exports = Server;