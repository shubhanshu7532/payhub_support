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
        type: String,
        select: false
    },
    apiKey: {
        type: String
    },
    role: {
        type: String,
        default: "admin",
        enum: ["admin", "super_admin"]
    },
    employedDate: {
        type: String,
        required: false
    },
    lastActive: { type: Date, default: null },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    updated: Date,
    created: {
        type: Date,
        default: Date.now
    }
});

SupportSchema.virtual('online').get(function () {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (this.lastActive === null) return false
    return this.lastActive >= tenMinutesAgo;;
});

SupportSchema.set('toJSON', { virtuals: true });


module.exports = Mongoose.model('Support', SupportSchema);
