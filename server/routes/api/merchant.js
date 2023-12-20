const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


// Bring in Models & Helpers
const { MERCHANT_STATUS, ROLES } = require('../../constants');
const Merchant = require('../../models/merchant');
const mailgun = require('../../services/mailgun');
const apiUrl = 'https://api.payhub.link/support/getAllMerchants';
const apiKey = 'dk3lonopa4i';
const emailId = 'samir123@payhub';

// add merchant api
router.post('/add', async (req, res) => {
  try {
    const { email_id, business_name, apiKey } = req.body;

    console.log("this is checkpoint 1");

    const existingMerchant = await Merchant.findOne({ email_id });

    const existingName = await Merchant.findOne({ business_name });


    console.log("this is checkpoint 2");
    if (existingMerchant) {
      return res
        .status(400)
        .json({ error: 'That email address is already in use.' });
    }

    if (existingName) {
      return res
        .status(400)
        .json({ error: 'That name is already in use.' });
    }

    console.log("this is checkpoint 3");

    const merchant = await Merchant.create({
      email_id,
      business_name,
      api_key: apiKey
    });

    console.log("this is checkpoint 4");
    const merchantDoc = await merchant.save();

    // await mailgun.sendEmail(email, 'merchant-application');
    console.log("this is checkpoint 5");
    res.status(200).json({
      success: true,
      merchant: merchantDoc
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});


/**
 * controller for adding merchants 
 */
router.get('/add', async (req, res) => {
  try {

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apiKey': apiKey,
      },
      body: JSON.stringify({
        emailId: emailId,
      }),
    });

    const data = await response.json();


    const data_promise = data.responseData.map(async (merchant) => {
      const merchant_data = await Merchant.findOne({ email_id: merchant.emailId })

      if (!merchant_data) {
        await Merchant.create({
          email_id: merchant.emailId,
          business_name: merchant.businessName,
          api_key: merchant.apiKey
        })
      }


    })

    await Promise.all(data_promise)

    return res.status(400).json({
      message: 'merchants added successfully'
    });


  } catch (error) {
    console.log(error)
    return res.status(400).json({
      error: 'Your request could not be processed. Please try again.'
    });
  }
});




module.exports = router;
