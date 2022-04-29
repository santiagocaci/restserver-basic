const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUsers = document.querySelector('#ulUsers');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

const url = 'http://localhost:8080/api/auth/';
let user = null;
let socket = null;

// Valida el token del localStorage
const validarJWTchat = async () => {
  const token = localStorage.getItem('token') || '';
  if (token.length <= 10) {
    window.location = 'index.html';
    throw new Error('No hay token en el servidor');
  }

  const resp = await fetch(url, {
    headers: {
      'x-token': token
    }
  })
    .then(resp => resp.json())
    .then(({ user: userDB, token: tokenDB }) => {
      localStorage.setItem('token', tokenDB);
      user = userDB;
      document.title = user.name;
    })
    .catch(err => { console.log(err) });

  await connectSocket();

}

const connectSocket = async () => {

  // Le da opciones al socket.io
  // Le agrega headers adicionales
  socket = io({
    extraHeaders: {
      'x-token': localStorage.getItem('token')
    }
  });

  socket.on('connect', () => {
    console.log('socket online');
  });


  socket.on('disconnect', () => {
    console.log('socket offline');
  });


  socket.on('recibir-msg', (payload) => {
    showMsg(payload);
  });


  // Manera uno:
  // socket.on('users-activos', (payload) => {
  //   showUserInHtml(payload);
  // });
  // Manera dos:
  socket.on('users-activos', showUserInHtml);


  socket.on('recibir-msg-privado', (payload) => {
    console.log('mensaje privado', payload);
  });
}

txtMsg.addEventListener('keyup', ({ key, keyCode }) => {

  const msg = txtMsg.value.trim();
  if (key !== "Enter" || keyCode !== 13) {
    return;
  }
  if (msg.length === 0) {
    return;
  }

  const uid = txtUid.value;
  socket.emit('enviar-mensaje', { msg, uid });
  txtMsg.value = '';

});

const showUserInHtml = (user) => {

  let userHtml = '';
  user.forEach(({ name, uid }) => {
    userHtml += `

    <li >
      <P>
        <h5 class="text-success">${name}</h5>
        <span class="fs-6 text-muted">${uid}</span>
      </p>
    </li>

    `;

    ulUsers.innerHTML = userHtml;
  });

}

const showMsg = (mensajes = []) => {

  let msgHtml = '';
  mensajes.forEach(({ name, msg }) => {
    msgHtml += `

    <li >
      <P>
        <span class="text-primary">${name}</span>
        <span class="fs-6 text-muted">${msg}</span>
      </p>
    </li>

    `;

    ulMensajes.innerHTML = msgHtml;
  });

}

const main = async () => {

  await validarJWTchat();
}

main();

// const server = io();