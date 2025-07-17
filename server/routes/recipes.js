const express = require('express');
const router = express.Router();
const { Recipe, validate } = require("../models/recipe");
const multer = require("multer");

// Multer configuration for recipes
const storageRecipe = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/recipes/'); // Separate directory for recipes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const uploadRecipe = multer({ storage: storageRecipe });

// Add new recipe with image upload (for nutritionist user)
router.post("/add", uploadRecipe.single('image'), async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        // Check if there is an uploaded file
        if (req.file) {
            req.body.imagePath = req.file.path; // Add the image path to the request body
        }

        const recipe = await new Recipe({ ...req.body }).save();

        res.status(201).send({ message: "המתכון נוצר בהצלחה" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Get list of recipes (for regular user)
router.get("/list", async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        res.send({ recipes });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
