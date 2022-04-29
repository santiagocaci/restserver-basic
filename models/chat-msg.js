class Mensaje {
  constructor(uid, name, msg) {
    this.uid = uid;
    this.name = name;
    this.msg = msg;
  }
}

class ChatMensajes {

  constructor() {
    this.mensajes = [];
    this.usuarios = {

    };
  }

  get ultimos10() {
    this.mensajes = this.mensajes.splice(0, 10);
    return this.mensajes;
  }

  // Retorna un array de objetos user
  get usuariosArr() {
    return Object.values(this.usuarios); // [ {}, {}, {} ]
  }

  enviarMensaje(uid, nameUser, msg) {
    this.mensajes.unshift(
      new Mensaje(uid, nameUser, msg)
    )
  }

  conectarUser(user) {
    this.usuarios[user.id] = user;
  }

  desconectarUser(id) {
    delete this.usuarios[id];
  }

}

module.exports = ChatMensajes;