const { response } = require('express');

const userGet = (req, res = response) => {
  const query = req.query;
  res.json({
    msg: 'get API - controlador',
    query,
  });
}

const userPost = (req, res = response) => {

  // Es importante que el body deba tener una limpieza
  const { name, age } = req.body;

  res.json({
    msg: 'post API - controlador',
    name,
    age,
  });
}

const userPut = (req, res = response) => {

  const id = req.params.id;

  res.json({
    msg: 'put API - controlador',
    id
  });
}

const userPatch = (req, res = response) => {
  res.json({
    msg: 'patch API - controlador'
  });
}

const userDelete = (req, res = response) => {
  res.json({
    msg: 'delete API - controlador'
  });
}

module.exports = {
  userGet,
  userPost,
  userPut,
  userPatch,
  userDelete,
}