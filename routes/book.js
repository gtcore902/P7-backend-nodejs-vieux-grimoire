const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { upload, processImage } = require('../middlewares/multer-config');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, upload, processImage, bookCtrl.createBook);
router.get('/bestrating', bookCtrl.getBestRating);

router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, upload, processImage, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.addRating);

module.exports = router;
