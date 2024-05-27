const mongoose = require('mongoose');

const userModelSchema =new mongoose.Schema({
    firstName:String,
    lastName: String, 
    email: String, 
    phoneNumber: String, 
    type: String,
    password: String
});

const userModel = mongoose.model('user', userModelSchema);

module.exports = {userModel}