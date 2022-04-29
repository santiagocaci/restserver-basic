const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConection } = require('../database/config.js');

const { socketController } = require('../sockets/socketController.js');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Configuracion con socket.io
    this.server = require('http').createServer(this.app);
    this.io = require('socket.io')(this.server);

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

    // Sockets
    this.sockets();
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
      useTempFiles: true,
      tempFileDir: '/tmp/',
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

  sockets() {
    // Mandando el io como argumento puedo hacer un emit general, avisando a todos que un user se conecto
    this.io.on('connection', (socket) => socketController(socket, this.io));
  }

  listen() {
    // Con el servidor de express sin socket.io es de esta forma
    // this.app.listen(this.port, () => {
    //   console.log('Servidor corriendo en puerto:', this.port);
    // });

    // Con el server de socket.io por que express no ocupa socket
    this.server.listen(this.port, () => {
      console.log('Servidor corriendo en el puerto:', this.port);
    });
  }
}

module.exports = Server;