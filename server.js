const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Recipe = require('./models/Recipe'); // Ensure the path is correct

const app = express();
app.use(express.json());

<<<<<<< HEAD
const mongoURI = 'mongodb+srv://mgmaddox05:Kx3bhdig@cookbook.r8ytb.mongodb.net/';
=======
const mongoURI = 'mongodb+srv://mgmaddox05:Kx3bhdig@cluster0.mongodb.net/';
>>>>>>> 7caffba232f97cf4a140294f02adc5557a417f15
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

app.post('/recipes', auth, async (req, res) => {
    const { name, type, ingredients, instructions } = req.body;
    try {
        const recipe = new Recipe({ userId: req.userId, name, type, ingredients, instructions });
        await recipe.save();
        console.log('Recipe saved:', recipe);
        res.status(201).json({ message: 'Recipe added successfully' });
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
