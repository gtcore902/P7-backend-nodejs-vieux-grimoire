const Book = require('../models/book');

exports.createBook = (req, res, next) => {
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
};
