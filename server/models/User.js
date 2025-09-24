const mongoose = require("mongoose");

console.log(" User model loaded");


const userSchema = new mongoose.Schema(
    {
        name: {
			type: String,
			required: true,
			trim: true,
		},
        email: {
			type: String,
			required: true,
			trim: true,
		},
        password: {
			type: String,
			required: true,
		},
        role: {
			type: String,
			enum: ['Admin', 'Member'],
            default: 'Member',
			required: true,
		},

       tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    },
    { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);