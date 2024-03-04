const multer = require('multer');
const sharp = require('sharp');
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

// Use multer to downloasd image
const upload = multer({ storage: storage }).single('image');

const deleteImg = (filePath) => {
  fs.unlink(filePath, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log('File deleted successfully!');
    }
  });
};
// Add middleware for traitment after download
const processImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Resize and compress image
  sharp(req.file.path)
    .resize(500)
    .jpeg({ quality: 80 })
    .toFile('images/resized/' + req.file.filename, (err, info) => {
      if (err) {
        return next(err);
      }
      // Remove initial image
      deleteImg(req.file.path);
      next();
    });
};

module.exports = { upload, processImage };
