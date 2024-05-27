const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const rentalModelSchema =new mongoose.Schema({
    place:String,
    area: String, 
    address: String, 
    nearTo: String, 
    furshining: String,
    noOfRooms: Number, 
    availableFrom: String,
    postedBy: String, 
    interested: {type:Array, default:[]} , 
    rentalId :{
        type: String,
        default: () => uuidv4(),
        unique: true
    }
});

const rentalModel = mongoose.model('rentals', rentalModelSchema);

module.exports = {rentalModel}