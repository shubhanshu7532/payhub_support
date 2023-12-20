const Mongoose = require('mongoose');

const { ROLES, EMAIL_PROVIDER } = require('../constants');

const { Schema } = Mongoose;

// User Schema
const SupportSchema = new Schema({
    email_id: {
        type: String,
        required: () => {
            return this.provider !== 'email' ? false : true;
        }
    },
    phone: {
        type: String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    password: {
        type: String
    },
    api_key: {
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
