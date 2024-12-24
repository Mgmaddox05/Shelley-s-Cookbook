const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');



const app = express();
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://mgmaddox05:Kx3bhdig@cookbook.r8ytb.mongodb.net/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));



const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access denied');
    }
    try {
        const decoded = jwt.verify(token, 'secretkey');
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};

const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    photo: { type: String }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;


app.post('/recipes', auth, async (req, res) => {
    const { name, type, ingredients, instructions, photo } = req.body;
    try {
        const recipe = new Recipe({ userId: req.userId, name, type, ingredients, instructions, photo });
        await recipe.save();
        console.log('Recipe saved:', recipe);
        res.status(201).send('Recipe added successfully');
    } catch (err) {
        console.error('Error saving recipe:', err);
        res.status(400).json({ message: 'Error adding recipe', error: err.message });
    }
});


app.get('/recipes', auth, async (req, res) => {
    try {
        const recipes = await Recipe.find({ userId: req.userId });
        res.json(recipes);
    } catch (err) {
        res.status(400).send('Error fetching recipes');
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
