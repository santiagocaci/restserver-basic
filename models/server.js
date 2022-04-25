const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConection } = require('../database/config.js');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      categorias: '/api/categorias',
      usuarios: '/api/usuarios',
      productos: '/api/productos',
      uploads: '/api/uploads'

    }

    // this.usuariosPath = '/api/usuarios';
    // this.authPath = '/api/auth';
    // this.categoriaPath

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

    // Fileupload - maneja la carga de archivos
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
  }));
  }

  routes() {
    // Los middlewares empiezan con .use
    this.app.use(this.paths.auth, require('../routes/auth.routes.js'));
    this.app.use(this.paths.buscar, require('../routes/search.routes.js'));
    this.app.use(this.paths.categorias, require('../routes/categorias.routes.js'));
    this.app.use(this.paths.productos, require('../routes/products.routes.js'));
    this.app.use(this.paths.usuarios, require('../routes/user.routes.js'));
    this.app.use(this.paths.uploads, require('../routes/uploads.routes.js'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto:', this.port);
    });
  }
}

module.exports = Server;