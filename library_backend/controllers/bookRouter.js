const express = require('express');
const bookRouter = express.Router();
const customError = require('../utils/customError');
const bookModel = require('../models/bookModel');
const mongoose = require('mongoose');

const authorModel = require('../models/authorModel');
const categoryModel = require('../models/categoryModel');
const userModel = require('../models/User/userModel');

const {
  adminTokenValidatorMiddleware,
} = require('../middle_wares/adminTokenMiddleware_validator');
const {
  bookJoiValidator_middleWare,
  uniqueBookNameValidator,
  references_middleware_validator,
} = require('../middle_wares/handling_book_middleware');

bookRouter.use(adminTokenValidatorMiddleware);
bookRouter.use(bookJoiValidator_middleWare);
bookRouter.use(references_middleware_validator);
bookRouter.use(uniqueBookNameValidator);

bookRouter.get('/', async (req, res, next) => {
  try {
    const books = await bookModel.find({});
    res.send(books);
  } catch (err) {
    next(customError(522, 'Server_Error', 'something went wrong'));
  }
});

bookRouter.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await bookModel.findById(id);
    if (!book) throw customError(422, 'ID_NOT_FOUND', 'NO_SUCH_BOOK');
    res.send(book);
  } catch (err) {
    next(err);
  }
});

bookRouter.get('/fulldata/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await bookModel.findById(id);
    if (!book) throw customError(422, 'ID_NOT_FOUND', 'NO_SUCH_BOOK');
    const {firstname, lastname}=await authorModel.findById({ _id:book.author})
    const {categoryName}=await categoryModel.findById({ _id:book.category})
    // book.category={categoryName,id:book.category}
    // book.author={firstname,lastname,id:book.author}
    const newbook={...(book._doc),
    category: {categoryName,id:book.category},
    author:{firstname,lastname,id:book.author}} 
    res.send(newbook);
  } catch (err) {
    next(err);
  }
});

bookRouter.get('/review/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await bookModel.findById(id);
    if (!book) throw customError(422, 'ID_NOT_FOUND', 'NO_SUCH_BOOK');
    console.log(book)
    const koky=await userModel.find({$and: [{books: {$elemMatch: {book:id}}},{books: {$elemMatch: {userRating:{ $ne: 0 }}}}]})
    
    
    res.send(koky);
  } catch (err) {
    next(err);
  }
});

bookRouter.delete('/:id', async (req, res, next) => {
  try {
    if(!req.isActive){
      throw customError(404, 'FORBIDDEN', "Account is inactive, activate your account first");
    }
    const id = req.params.id;
    //await bookModel.deleteOne({_id: id});
    //res.send({success: 'OK'})
    const idObj = mongoose.Types.ObjectId(id);
    await userModel.updateMany({}, {$pull: {books: idObj}});
    bookModel.deleteOne(
      {
        _id: id,
      },
      (err, output) => {
        if (!err) {
          res.send(output);
        } else {
          res.send(err);
        }
      }
    );
    
    
  } catch (err) {
    next(err);
  }
});

bookRouter.post('/', async (req, res, next) => {
  const bookData = req.body;
  try {
    if(!req.isActive){
      throw customError(404, 'FORBIDDEN', "Account is inactive, activate your account first");
    }
    const { bookName, rating, photo, category, author, brief } = bookData;
    await bookModel.create({ bookName, rating, photo, category, author, brief});
    res.send({ success: 'book created successfully' });
    return;
  } catch (error) {
    next(error);
  }
});

bookRouter.patch('/:id', async (req, res, next) => {
  let _id = req.params.id;
  const newBookData = req.body;
  try {
    if(!req.isActive){
      throw customError(404, 'FORBIDDEN', "Account is inactive, activate your account first");
    }
    const exists = await bookModel.findById({ _id });
    if (!exists) {
      throw customError(400, 'NOT_FOUND', 'No such Book');
    }
    await bookModel.findByIdAndUpdate({ _id }, newBookData);
    res.send({ success: 'book updated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = bookRouter;
