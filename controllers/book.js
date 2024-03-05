const Book = require('../models/book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
  const bookThing = JSON.parse(req.body.book);
  delete req.body._id;
  delete req.body._userId;
  const book = new Book({
    ...bookThing,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/resized/${
      req.file.filename
    }`,
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

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/resized/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: 'unauthorized request' });
      } else {
        // Remove old file if new file submitted
        if (req.file) {
          fs.unlink(
            'images/' + book.imageUrl.split('/images/')[1],
            (error, info) => {
              if (error) {
                console.log(error);
              }
            }
          );
        }
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => {
            res.status(200).json({ message: 'Modified!' });
          })
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: 'unauthorized request' });
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Deleted!' });
            })
            .catch((error) => {
              res.status(401).json({ error });
            });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.addRating = (req, res, next) => {
  const userId = req.auth.userId;
  const grade = req.body.rating;

  if (!grade || grade < 0 || grade > 5) {
    return res.status(400).json({ message: 'Invalid rating' });
  }
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      const userRating = book.ratings.find(
        (rating) => rating.userId === userId
      );
      if (userRating) {
        return res.status(400).json({ message: 'You already added ratings' });
      }
      book.ratings.push({ userId, grade });
      const averageRating = (
        book.ratings.reduce((acc, rating) => acc + rating.grade, 0) /
        book.ratings.length
      ).toFixed(1);

      book.averageRating = Math.round(Number(averageRating));
      return book.save();
    })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(500).json({ erreur: error }));
};
