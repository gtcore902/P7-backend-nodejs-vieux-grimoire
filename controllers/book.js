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

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getBestRating = (req, res, next) => {
  Book.find()
    .then((books) => {
      books.sort((a, b) => b.averageRating - a.averageRating);
      const topThreeBooks = books.slice(0, 3);
      res.status(200).json(topThreeBooks);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => res.status(404).json({ error }));
};
