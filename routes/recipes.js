const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipe');

// Fetch all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new recipe
router.post('/', async (req, res) => {
    const recipe = new Recipe({
        name: req.body.name,
        type: req.body.type,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
    });
    try {
        const newRecipe = await recipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
