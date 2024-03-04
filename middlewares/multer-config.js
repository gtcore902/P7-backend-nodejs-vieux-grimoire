// const multer = require('multer');
// const sharp = require('sharp');

// const MIME_TYPES = {
//   'image/jpg': 'jpg',
//   'image/jpeg': 'jpeg',
//   'image/png': 'png',
// };

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, 'images');
//   },
//   filename: (req, file, callback) => {
//     const name = file.originalname.split(' ').join('_');
//     const extension = MIME_TYPES[file.mimetype];
//     callback(null, name + Date.now() + '.' + extension);
//   },
// });

// module.exports = multer({ storage: storage }).single('image');

const multer = require('multer');
const sharp = require('sharp'); // Importez sharp
const fs = require('fs');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
});

// Utilisez multer pour télécharger l'image
const upload = multer({ storage: storage }).single('image');

const deleteImg = (filePath) => {
  fs.unlink(filePath, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log('ok');
    }
  });
};
// Middleware pour traiter l'image après téléchargement
const processImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Utilisez sharp pour redimensionner l'image
  sharp(req.file.path)
    .resize(500) // Redimensionnez l'image selon vos besoins
    .toFile('images/resized/' + req.file.filename, (err, info) => {
      if (err) {
        return next(err);
      }
      // Stockez l'emplacement de l'image redimensionnée dans req
      req.resizedImagePath = 'images/resized/' + req.file.filename;
      deleteImg(req.file.path);
      next();
    });
};

module.exports = { upload, processImage };
