const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const checkAuth = require('../../utils/super_admin_auth')
const keys = require('../../config/keys');
const cookieParser = require('cookie-parser');
const { secret, tokenLife } = keys.jwt



const Support = require("../../models/supporter")

// Bring in Models & Helpers


async function generateApiKey(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        apiKey += charset[randomIndex];
    }

    return apiKey;
}

router.post('/add', checkAuth, async (req, res) => {
    try {

        const { email_id, phone, first_name, last_name, password } = req.body

        const email_exist = await Support.findOne({ email_id: email_id })

        if (email_exist) {
            return res.status(400).json({
                error: 'email already exists'
            });
        }

        const phone_exist = await Support.findOne({ phone: phone })

        if (phone_exist) {
            return res.status(400).json({
                error: 'phone already exist'
            });
        }


        if (!first_name) {
            return res.status(400).json({
                error: 'Please enter the first name'
            });
        }

        if (!last_name) {
            return res.status(400).json({
                error: 'Please enter the last name'
            });
        }

        let apiKey = await generateApiKey(16);


        const existingApiKey = await Support.findOne({ api_key: apiKey });


        while (existingApiKey) {
            apiKey = generateApiKey(16);
            existingApiKey = await Support.findOne({ api_key: apiKey });
        }


        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);


        const user_password = hash;


        const supporter = await Support.create({
            email_id,
            phone,
            first_name,
            last_name,
            password: user_password,
            api_key: apiKey,
            role: "admin"
        })


        const payload = {
            id: supporter.id
        };

        const token = jwt.sign(payload, secret, { expiresIn: tokenLife });



        return res.status(200).json({
            message: 'support member created successfully'
        });

    } catch (error) {
        return res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email_id, password } = req.body;

        if (!email_id) {
            return res
                .status(400)
                .json({ error: 'You must enter an email_id address.' });
        }

        if (!password) {
            return res.status(400).json({ error: 'You must enter a password.' });
        }

        const supporter = await Support.findOne({ email_id });
        if (!supporter) {
            return res
                .status(400)
                .send({ error: 'No supporter found for this email_id address.' });
        }


        const isMatch = await bcrypt.compare(password, supporter.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: 'Password Incorrect'
            });
        }

        const payload = {
            id: supporter.id
        };

        const token = jwt.sign(payload, secret, { expiresIn: tokenLife });

        if (!token) {
            throw new Error();
        }
        res.cookie('token', token, { maxAge: 900000, httpOnly: true });



        res.status(200).json({
            success: true,
            supporter: {
                id: supporter.id,
                firstName: supporter.first_name,
                lastName: supporter.last_name,
                email_id: supporter.email_id,
                role: supporter.role
            }
        });
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});








module.exports = router;
