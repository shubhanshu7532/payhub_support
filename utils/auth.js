const jwt = require('jsonwebtoken');
const keys = require('../config/keys')
const Support = require('../models/supporter')
const { secret, tokenLife } = keys.jwt


const secretKey = 'your-secret-key'; // Replace with your actual secret key

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            responseCode: 401,
            responseMessage: 'Unauthorized'
        });
    }

    jwt.verify(token, secret, async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({
                responseCode: 401,
                responseMessage: 'Unauthorized'
            });
        }

        // Attach the user ID to the request object for use in controllers
        const supporterId = decodedToken.id;

        try {
            const supporter = await Support.findOne({ id: supporterId });

            if (!supporter) {
                return res.status(401).json({
                    responseCode: 401,
                    responseMessage: 'Unauthorized'
                });
            }

            req.supporter = supporter;

            supporter.lastActive = new Date();
            await supporter.save();

            // Call next() inside the callback after all asynchronous operations are complete
            next();
        } catch (error) {
            // Handle any database or other errors
            console.error('Error:', error);
            return res.status(500).json({
                responseCode: 500,
                responseMessage: 'Internal Server Error'
            });
        }
    });
};


module.exports = authenticateJWT;
