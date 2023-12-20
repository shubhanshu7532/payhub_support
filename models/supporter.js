const Mongoose = require('mongoose');

const { ROLES, EMAIL_PROVIDER } = require('../constants');

const { Schema } = Mongoose;

// User Schema
const SupportSchema = new Schema({
    emailId: {
        type: String,
    },
    name: {
        type: String
    },
    password: {
        type: String
    },
    apiKey: {
        type: String
    },
    role: {
        type: String,
        default: "admin",
        enum: ["admin", "super_admin"]
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = Mongoose.model('Support', SupportSchema);
