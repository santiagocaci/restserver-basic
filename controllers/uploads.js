const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFile } = require("../helpers");
const { User, Product } = require("../models");
const { response } = require('express');

const loadFile = async (req, res) => {


  console.log('req.files >>>', req.files); // eslint-disable-line

  try {

    const pathCompletoConNombre = await uploadFile(req.files, undefined, 'img');
    res.json({
      name: pathCompletoConNombre
    });

  } catch (error) {
    res.status(400).json({
      msg: error
    });
  }

}

// Este update es para utilizarlo de manera local, en un host se necesita las imagenes de un  servidor
// const updateImage = async (req, res) => {
//   const { collection, id } = req.params;
//   const { model } = req;
//   // Limpia imagenes previas
//   if (model.img) {
//     // Hay que borrar las imagenes del servidor
//     const pathImg = path.join(__dirname, '../uploads', collection, model.img);
//     if (fs.existsSync(pathImg)) {
//       fs.unlinkSync(pathImg);
//     }
//   }
//   const nameFile = await uploadFile(req.files, undefined, collection);
//   model.img = nameFile;
//   await model.save();
//   res.json({
//     collection,
//     id,
//     model,
//   });
// }

const updateImageCloudinary = async (req, res) => {

  const { collection, id } = req.params;
  const { model } = req;
  // Limpia imagenes previas
  if (model.img) {
    const nombreArr = model.img.split('/');
    const name = nombreArr[nombreArr.length - 1];
    const [public_id] = name.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  model.img = secure_url;
  await model.save();

  res.json(model);
}

const showImage = (req, res = response) => {
  const { collection } = req.params;
  const { model } = req;


  // Limpia imagenes previas
  if (model.img) {

    // Hay que borrar las imagenes del servidor
    const pathImg = path.join(__dirname, '../uploads', collection, model.img);

    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }
  }

  const pathImgDefault = path.join(__dirname, '../assets/no-image.jpg');

  res.sendFile(pathImgDefault);

}

module.exports = {
  loadFile,
  // updateImage,
  showImage,
  updateImageCloudinary
}