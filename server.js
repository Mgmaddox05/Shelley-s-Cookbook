const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const User = require('./models/User');


const app = express();
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://mgmaddox05:Kx3bhdig@cookbook.r8ytb.mongodb.net/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the new user
        const user = new User({ username, password: hashedPassword });
        await user.save();

        // Respond with success message
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        // Log detailed error message and send JSON error response
        console.error('Error registering user:', err);
        res.status(400).json({ message: 'Error registering user', error: err.message });
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid username or password');
        }
        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(400).send('Error logging in');
    }
});

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

const RecipeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    photo: { type: String }
});
const Recipe = mongoose.model('Recipe', RecipeSchema);

app.post('/recipes', auth, async (req, res) => {
    const { name, type, ingredients, instructions, photo } = req.body;
    try {
        const recipe = new Recipe({ userId: req.userId, name, type, ingredients, instructions, photo });
        await recipe.save();
        console.log('Recipe saved:', recipe);
        res.status(201).send('Recipe added successfully');
    } catch (err) {
        console.error('Error saving recipe:', err);
        res.status(400).send('Error adding recipe');
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
