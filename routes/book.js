const express = require('express');
// const Book = require('../models/book');
const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks); // auth à supprimer après
router.post('/', multer, bookCtrl.createBook);
router.get('/bestrating', bookCtrl.getBestRating);

router.get('/:id', bookCtrl.getOneBook);

router.delete('/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Deleted!' }))
    .catch((error) => {
      res.status(400).json({ error });
    });
});

module.exports = router;
