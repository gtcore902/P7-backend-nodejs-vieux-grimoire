const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
// const multer = require('../middlewares/multer-config');
const { upload, processImage } = require('../middlewares/multer-config');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, upload, processImage, bookCtrl.createBook);
router.get('/bestrating', bookCtrl.getBestRating);

router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, upload, processImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.addRating); // add auth

router.delete('/:id', (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Deleted!' }))
    .catch((error) => {
      res.status(400).json({ error });
    });
});

module.exports = router;
