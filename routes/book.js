const express = require('express');
const Book = require('../models/book');
const router = express.Router();
const bookCtrl = require('../controllers/book');

// router.get('/', (req, res, next) => {
//   Book.find()
//     .then((books) => {
//       res.status(200).json(books);
//     })
//     .catch((error) => res.status(400).json({ error }));
// });

router.get('/', bookCtrl.getAllBooks);
router.post('/', bookCtrl.createBook);
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
