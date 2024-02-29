const express = require('express');
const app = express();

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
  const datas = req.body;
  console.log(req.body);
  res.status(201).json({ ...datas });
});

app.get('/api/books', (req, res, next) => {
  const books = [
    {
      id: 'oeihfzeoi',
      title: 'livre 1',
      author: 'Gaëtan TREMOIS',
      imageUrl: '',
      year: 2024,
      genre: 'Polar',
      ratings: [],
      averageRating: 3,
    },
    {
      id: 'oeihfzeol',
      title: 'livre 2',
      author: 'Gaëtan TREMOIS',
      imageUrl: '',
      year: 2001,
      genre: 'Fiction',
      ratings: [],
      averageRating: 2,
    },
  ];
  res.status(200).json(books);
});

app.get('/test', (req, res, next) => {
  res.status(200).json({ message: 'Ok page test !' });
});

module.exports = app;
