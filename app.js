const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Book = require('./models/book');

mongoose
  .connect(
    'mongodb+srv://gtcore902:bmjencOWxnAgd5Xn@cluster0.kw1ah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connection to MongoDB successful!'))
  .catch((e) => console.log(e));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.post('/api/books', (req, res, next) => {
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

app.get('/api/books', (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => res.status(400).json({ error }));
});

app.get('/api/books/bestrating', (req, res, next) => {
  Book.find()
    .then((books) => {
      books.sort((a, b) => b.averageRating - a.averageRating);
      const topThreeBooks = books.slice(0, 3);
      res.status(200).json(topThreeBooks);
    })
    .catch((error) => res.status(400).json({ error }));
});

app.get('/api/books/:id', (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => res.status(404).json({ error }));
});

app.delete('/api/books/:id', (req, res, next) => {
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Deleted!' }))
    .catch((error) => {
      res.status(400).json({ error });
    });
});

module.exports = app;
