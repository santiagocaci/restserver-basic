const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'], directory = '') => {

  return new Promise((resolve, reject) => {

    const { file } = files;

    // "example.algo" => [ "example", "algo"]
    const cutName = file.name.split('.');

    const extension = cutName[cutName.length - 1];

    if (!validExtensions.includes(extension)) {
      return reject(`La extension ${extension} no es permitida - ${validExtensions}`);
    }

    const tempName = uuidv4() + '.' + extension;

    const uploadPath = path.join(__dirname, '../uploads/', directory, tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(tempName);
    });
  })

}

module.exports = {
  uploadFile
}