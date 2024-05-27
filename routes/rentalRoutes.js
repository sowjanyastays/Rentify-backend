const express = require('express');
const rentalController = require('../controllers/rentalController');
const verifyToken = require('../middlewares/verifyToken');

const rentalRouter = express.Router();
rentalRouter.get('/getAllRentals' ,rentalController.getAllRentals);
rentalRouter.post('/getRentalById', rentalController.getRentalById);
rentalRouter.post('/getRentalByEmail',verifyToken , rentalController.getRentalByEmail)
rentalRouter.post('/postRental',verifyToken ,rentalController.createRental);
rentalRouter.post('/updateRental', verifyToken,rentalController.updateRental);
rentalRouter.post('/deleteRental', verifyToken,rentalController.deleteRental);
rentalRouter.post('/interested',verifyToken,rentalController.interestShown)

module.exports = rentalRouter;