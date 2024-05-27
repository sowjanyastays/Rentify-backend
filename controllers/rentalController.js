//Operations in this Controller 1.Post a propery, 2.Update a property, 3.Delete a property 4. Get all Properties

const { rentalModel } = require("../models/rentalModel");
const { userModel } = require("../models/userModel");
const {transporter} = require('../services/nodeMailer')

const getAllRentals = async (req, res) => {
    try {
        const rentals = await rentalModel.find();
        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRental = async (req, res) => {
    const {place, area, address, nearTo, furshining, noOfRooms, availableFrom, postedBy} = req.body
    const rental = new rentalModel({place, area, address, nearTo, furshining, noOfRooms, availableFrom, postedBy});
    try {
        const savedRental = await rental.save();
        res.status(201).json(savedRental);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateRental = async (req, res) => {
    try {
        const { rentalId } = req.body;
        const updatedRental = await rentalModel.findOneAndUpdate({ rentalId: rentalId }, req.body, { new: true });
        if (!updatedRental) {
            return res.status(404).json({ message: 'Rental not found' });
        }
        res.status(200).json(updatedRental);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteRental = async (req, res) => {
    const { rentalId } = req.body;

    try {
        const deletedRental = await rentalModel.findOneAndDelete({rentalId: rentalId });
        if (!deletedRental) {
            return res.status(404).json({ message: 'Rental not found' });
        }
        res.status(200).json({ message: 'Rental deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const interestShown = async (req, res) =>{
    const {rentalId, email} = req.body;
    try{
        const existingRental = await rentalModel.findOne({ rentalId: rentalId });
        if(existingRental){
            if (!existingRental.interested.includes(email)) {
                existingRental.interested.push(email);
                await existingRental.save();
                const mailOptions = {
                    from: 'rental@gmail.com',
                    to: existingRental.postedBy,
                    subject: 'New Interest Shown in Your Rental Property',
                    text: `A new interest has been shown in your rental property at ${existingRental.address} by ${email}.`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email: ', error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                const ownerDetails =await userModel.findOne({email:existingRental.postedBy});
                console.log(ownerDetails);

                const mailOptionsToUser = {
                    from: 'rental@gmail.com',
                    to: email,
                    subject: 'Owner Details sent',
                    text: `
                    Owner Name : ${ownerDetails.firstName + ownerDetails.lastName};
                    Phone Number : ${ownerDetails.phoneNumber}
                    `
                };

                transporter.sendMail(mailOptionsToUser, (error, info) => {
                    if (error) {
                        console.error('Error sending email: ', error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.status(200).json({ message: 'Interest shown successfully', rental: existingRental });
            }else {
                return res.status(200).json({ message: 'Email already exists in the interested list' });
            }
        }else {
            return res.status(404).json({ message: 'Rental not found' });
        }
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}

const getRentalById = async (req, res)=>{
    try {
        const { rentalId } = req.body;
        const existingRental = await rentalModel.findOne({ rentalId: rentalId });
        if(existingRental){
            const ownerDetails = await userModel.findOne({email:existingRental.postedBy});
            return res.status(200).json({ message: "found", status:"200 OK", details:existingRental, ownerDetails:ownerDetails });
        }else{
            return res.status(200).json({ message: "No such rental", status:"200 OK"});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getRentalByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        // Assuming you have a Rental model defined
        const rentals = await rentalModel.find({ postedBy: email });
        console.log(rentals);
        res.status(200).json(rentals);
    } catch (error) {
        console.error('Error fetching rentals by email:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {createRental, deleteRental, updateRental, getAllRentals, interestShown, getRentalById, getRentalByEmail};