const miForm = document.querySelector('#formManual');
const url = 'http://localhost:8080/api/auth/';

miForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const formData = {};

  // Lee los input dentro del formulario
  for (let elto of miForm.elements) {
    if (elto.name.length > 0) {
      formData[elto.name] = elto.value;
    }
  }

  fetch(url + 'login', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(resp => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem('token', token);
      window.location = 'chat.html';

    })
    .catch(err => {
      console.log(err);
    });
});

function handleCredentialResponse(response) {
  // Google Token: ID_TOKEN
  // console.log('id_token', response.credential);

  // El fetch por defecto es una peticion GET, en este caso queremos hacer una peticion POST para poder obtener los tokens
  // para eso cambiamos las configuraciones de fetch especificando el metodo y mandando el header y el body serealizado como un JSON

  const body = { id_token: response.credential };

  fetch(url + 'google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(resp => resp.json())
    .then(({ token }) => {
      localStorage.setItem('token', token);
      window.location = 'chat.html';
    })
    .catch(err => console.warn(err));
}

const buttonSignOut = document.getElementById('google_signout_buttom');
buttonSignOut.onclick = () => {
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem('email'), () => {
    localStorage.clear();
    location.reload();
  });
}
