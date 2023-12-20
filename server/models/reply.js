const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    images: {
        type: [mongoose.Schema.Types.Mixed], // Assuming JSON-like data in the array
        default: [],
    },
    description: {
        type: String,
        default: null,
    },
    creator_name: {
        type: String,
    },
    creator_role: {
        type: String,
    },
    user_id: {
        type: String, // Assuming UUID is stored as a string
        required: true,
    },
    issue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue', // Reference to the Issue model
        required: true,
    },
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply 