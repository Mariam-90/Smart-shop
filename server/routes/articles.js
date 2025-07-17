const express = require('express');
const router = express.Router();
const { Article, validate } = require("../models/article"); // ודא שהייבוא נכון
const multer = require("multer");

// Multer configuration for articles
const storageArticle = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/articles/'); // Separate directory for articles
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const uploadArticle = multer({ storage: storageArticle });

router.post("/add", uploadArticle.single('image'), async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        // Check if there is an uploaded file
        if (req.file) {
            req.body.imagePath = req.file.path; // Add the image path to the request body
        }

        const article = await new Article({ ...req.body }).save();

        res.status(201).send({ message: "הכתבה נוצרה בהצלחה" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get("/list", async (req, res) => {
    try {
        const articles = await Article.find({});
        res.send({ articles });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
