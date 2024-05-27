// Operations in this controller 1.Login 2.SignUp
const { userModel } = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const JWT_SECRET = require('../middlewares/config');
require('dotenv').config();

const singup = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, type, password } = req.body;
  try {
    let existingUser;
    existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(200)
        .json({ message: "User already exists", status: "200 OK" });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
    let newUser = new userModel({
      firstName,
      lastName,
      email,
      phoneNumber,
      type,
      password: hashedPassword
    });
    await newUser.save();
    return res
      .status(200)
      .json({
        message: "Account created successfully",
        status: "200 OK",
        details: { email: newUser.email, type: newUser.type },
      });
    }
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user;
    user = await userModel.findOne({ email });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        console.log(user,process.env.JWT_SECRET,);
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token);
        return res.status(200).json({ status: "200 OK", message: "correct" , token});
      } else {
        return res
          .status(200)
          .json({
            status: "400 unauthorized",
            message: "Email/Password is incorrect",
          });
      }
    } else {
      return res
        .status(200)
        .json({
          status: "400 unauthorized",
          message: "No such user. Please register to continue",
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const checkUser = async (req, res) => {
  const { email } = req.body;
  if(req.user){
    try {
      let user;
      user = await userModel.findOne({ email });
      if (user) {
        return res
          .status(200)
          .json({
            status: "200 OK",
            message: "correct",
            details: { email: user.email, type: user.type },
          });
      } else {
        return res
          .status(200)
          .json({
            status: "400 unauthorized",
            message: "No such user. Please register to continue",
          });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }else{
    res.status(200).json({ message: "Unauthorized" });
  }
 
};


module.exports = {
  signin, 
  singup, 
  checkUser
}