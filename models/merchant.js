const mongoose = require('mongoose');

const merchantSchema = new mongoose.Schema({
  email_id: {
    type: String,
    allowNull: true,
    unique: true,
    // validate: {
    //   isEmail: true,
    // },
  },
  business_name: {
    type: String,
    required: true,
  },
  api_key: {
    type: String,
    required: true,
  },
});

const Merchant = mongoose.model('Merchant', merchantSchema);

module.exports = Merchant;
