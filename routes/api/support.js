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

        const { emailId, name, password, apiKey, employedDate } = req.body

        const email_exist = await Support.findOne({ emailId: emailId })

        if (email_exist) {
            return res.status(400).json({
                error: 'email already exists'
            });
        }

        if (!name) {
            return res.status(400).json({
                error: 'Please enter the name'
            });
        }




        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);


        const user_password = hash;


        const supporter = await Support.create({
            emailId,
            name,
            password: user_password,
            apiKey: apiKey,
            employedDate: employedDate || "",
            role: "admin"
        })


        const payload = {
            id: supporter.id
        };

        const token = jwt.sign(payload, secret, { expiresIn: tokenLife });



        return res.status(200).json({
            "responseCode": 200,
            "responseMessage": "Success"
        });

    } catch (error) {
        return res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId) {
            return res
                .status(500)
                .json({
                    responseCode: 500,
                    responseMessage: "Please provide me the email",
                });
        }

        if (!password) {
            return res.status(500).json({
                responseCode: 500,
                responseMessage: "Please provide me the password",
            });
        }

        const supporter = await Support.findOne({ emailId }).select('+password');;
        if (!supporter) {
            return res
                .status(500)
                .send({
                    responseCode: 500,
                    responseMessage: "No user found for this email address",
                });
        }


        const isMatch = await bcrypt.compare(password, supporter.password);

        if (!isMatch) {
            return res.status(500).json({
                responseCode: 500,
                responseMessage: "Password incorrect",
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
            responseCode: 200,
            responseMessage: "Logged In successfully",
            responseData: {
                emailId: supporter.emailId,
                name: supporter.name
            }
        });


    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: "Api error",
        });
    }
});


router.get('/', checkAuth, async (req, res) => {
    try {

        const { limit = 10, skip = 0, search } = req.query;

        // Define the query object based on the search parameter
        const query = search
            ? { $or: [{ emailId: new RegExp(search, 'i') }, { name: new RegExp(search, 'i') }] }
            : {};

        // Retrieve supporters based on the query, limit, and skip
        const supporters = await Support.find(query)
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        console.log(supporters)

        res.status(200).json({
            responseCode: 200,
            responseMessage: "Supporters retrieved successfully",
            responseData: supporters,
        });

    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: "Api error",
        });
    }
});








module.exports = router;
