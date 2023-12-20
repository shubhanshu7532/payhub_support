const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Bring in Models & Helpers
const { MERCHANT_STATUS, ROLES } = require('../../constants');
const Merchant = require('../../models/merchant');

const Issue = require('../../models/issue')

const mailgun = require('../../services/mailgun');

const multer = require('multer');
const storage = multer.memoryStorage(); // You can also use disk storage if you want to store files on disk
const upload = multer({ storage: storage });
const fs = require("fs").promises
const path = require("path")

// add merchant api
router.post('/', upload.array('files', 5), async (req, res) => {
    try {
        const { business_name, business_id, description } = req.body;

        const apiKey = req.headers.apikey;

        const merchant = await Merchant.findOne({ api_key: apiKey });

        if (!merchant) return res.status(404).json({ error: "Business not found" });



        const files = req.files;

        if (!files) return res.status(400).json({ error: "No files were uploaded" });
        if (files.length > 6) return res.status(400).json({ error: "Maximum 6 files allowed" });

        let uploaded = [];

        console.log("checkpoint 1")

        for (const file of files) {
            if (!file.mimetype.startsWith("image")) return res.status(400).json({ error: "Only images can be uploaded" });
            const buffers = file.buffer;
            const originalnames = file.originalname;

            // Define the path where the file will be saved in the public folder
            const publicFolderPath = path.join(__dirname, 'public');
            const filePath = path.join(publicFolderPath, originalnames);

            // Create the public folder if it doesn't exist
            await fs.mkdir(publicFolderPath, { recursive: true });
            console.log(filePath, buffers)

            // Write the file buffer to the public folder
            await fs.writeFile(filePath, buffers);

            // Provide the relative path in the response
            const relativePath = path.join('public', originalnames);

            console.log("checkpoint 9")

            // Assuming you have a function to save the media file to MongoDB
            // const media = await saveMediaFile(file, "file", "media");

            uploaded.push(filePath);
        }

        const issue = new Issue({
            images: uploaded,
            business_name,
            business_id,
            description
        });

        await issue.save();

        return res.status(200).json(issue);
    } catch (error) {
        return res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});

// search merchants api
router.get('/', async (req, res) => {
    try {
        const { status = "pending", limit = 20, skip = 0 } = req.query;

        let where = {};

        if (status) {
            if (status === "pending") {
                where = {
                    ...where,
                    assigned_to: null
                };
            } else if (status === "rejected" || status === "resolved") {
                where = {
                    ...where,
                    status: status,
                    assigned_to: req.user.id // Assuming you have user information in req.user
                };
            }

            where = {
                ...where,
                status: status
            };
        }

        const issues = await Issue.find(where)
            .limit(parseInt(limit, 10))
            .skip(parseInt(skip, 10))
            .sort({ createdAt: 'desc' });

        return res.status(200).json(issues);
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});

// fetch all merchants api
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const issue = await Issue.findById(id);

        if (!issue) return res.status(404).json({ error: "Issue not found" });

        return res.status(200).json(issue);
    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});

// disable merchant account
router.put('/:id', async (req, res) => {
    try {

    } catch (error) {
        res.status(400).json({
            error: 'Your request could not be processed. Please try again.'
        });
    }
});


module.exports = router;
