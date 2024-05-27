const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userRouter = require('./routes/userRoutes');
const rentalRouter = require('./routes/rentalRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(`Connected to Mongo`))
    .catch(err => console.log(err));

app.use(userRouter);
app.use(rentalRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
