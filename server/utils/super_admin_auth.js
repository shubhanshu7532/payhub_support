const jwt = require('jsonwebtoken');

const checkAuth = async (req, res, next) => {
    try {

        if (!req.headers.apikey) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if (req.headers.apikey !== process.env.SUPER_ADMIN_AUTH_KEY) return res.status(401).json({ message: "Unauthorized" })

        next()

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
};

module.exports = checkAuth;
