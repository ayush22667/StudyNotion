const mongoose = require("mongoose");

// Define the Profile schema
const profileSchema = new mongoose.Schema({
	gender: {
		type: String,
	},
	dateOfBirth: {
		type: String,
	},
	about: {
		type: String,
		trim: true,
	},
	contactNumber: {
		type: Number,
		trim: true,
	},
	mobileNo: {
		type: String,
		trim: true,
	},
	villageCity: {
		type: String,
		trim: true,
	},
	fatherName: {
		type: String,
		trim: true,
	},
	fatherMobileNo: {
		type: String,
		trim: true,
	},
	collegeName: {
		type: String,
		trim: true,
	},
});

// Export the Profile model
module.exports = mongoose.model("Profile", profileSchema);
