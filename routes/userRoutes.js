const express = require('express');
const userController = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');

const userRouter = express.Router();
userRouter.post('/signup', userController.singup);
userRouter.post('/signin', userController.signin);
userRouter.post('/checkUser',verifyToken ,userController.checkUser);

module.exports = userRouter;