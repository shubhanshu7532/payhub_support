const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    images: {
        type: [mongoose.Schema.Types.Mixed], // Assuming JSON-like data in the array
        default: [],
    },
    description: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ["pending", "failed", "success", "charge back", "refund", "in-process"],
        default: "pending",
    },
    business_name: {
        type: String,
        default: null,
    },
    business_id: {
        type: String,
        default: null,
    },
    assigned_to: {
        type: String, // Assuming UUID is stored as a string
        default: null,
    },
    reply_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply', // Reference to the Reply model
    },
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
