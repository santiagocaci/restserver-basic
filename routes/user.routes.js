const { Router } = require('express');
const { userGet,
  userPut,
  userPost,
  userDelete,
  userPatch } = require('../controllers/user.controller');

const router = Router();

module.exports = router;

router.get('/', userGet);

router.post('/', userPost);

router.put('/:id', userPut);

router.patch('/', userPatch);

router.delete('/', userDelete);