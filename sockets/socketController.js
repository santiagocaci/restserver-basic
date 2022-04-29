const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();

const socketController = async (socket, io) => {

  // Para verificar si el cliente esta conectado
  // console.log('Cliente conectado', socket.id);
  // console.log(socket.handshake.headers['x-token']);


  const user = await comprobarJWT(socket.handshake.headers['x-token']);
  if (!user) {
    return socket.disconnect();
  }

  // Primero se agrega al user conectado
  chatMensajes.conectarUser(user);
  // Emite todos los usuarios
  io.emit('users-activos', chatMensajes.usuariosArr);
  socket.emit('recibir-msg', chatMensajes.ultimos10);

  // Conectar el socket a una sala especial
  // Con esto el socket tendra 3 salas conectadas, la global de chat general, la conecktada con el socket.id que no se debe usar por que el id es muy volatil y la sala conectada por el id del user
  socket.join(user.id)

  socket.on('disconnect', () => {
    chatMensajes.desconectarUser(user.uid);
    io.emit('users-activos', chatMensajes.usuariosArr);
  });

  socket.on('enviar-mensaje', ({ uid, msg }) => {
    console.log(user.id);
    if (uid) {
      // Mensaje privado
      socket.to(uid).emit('recibir-msg-privado', { de: user.name, msg });
    } else {
      // Mensaje general
      chatMensajes.enviarMensaje(user.id, user.name, msg);
      io.emit('recibir-msg', chatMensajes.ultimos10);
    }
  })
}

module.exports = {
  socketController
}