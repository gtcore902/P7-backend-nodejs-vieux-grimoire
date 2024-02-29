const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.post('/', (req, res, next) => {
  delete req.body._id;
  delete req.body._userId;
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: 'Saved!' }))
    .catch((error) => {
      res.status(400).json({ error });
    });
});

router.get('/', (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => res.status(400).json({ error }));
});

router.get('/bestrating', (req, res, next) => {
  Book.find()
    .then((books) => {
      books.sort((a, b) => b.averageRating - a.averageRating);
      const topThreeBooks = books.slice(0, 3);
      res.status(200).json(topThreeBooks);
    })
    .catch((error) => res.status(400).json({ error }));
});

router.get('/:id', (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => res.status(404).json({ error }));
});

router.delete('/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Deleted!' }))
    .catch((error) => {
      res.status(400).json({ error });
    });
});

module.exports = router;
