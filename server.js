const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); // Import multer for handling file uploads
const Recipe = require('./models/Recipe');

const app = express();
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
const upload = multer({ storage: storage });

const mongoURI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority';
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

// Add recipe endpoint with file upload
app.post('/recipes', auth, upload.single('photo'), async (req, res) => {
    const { name, type, ingredients, instructions } = req.body;
    const photo = req.file ? req.file.path : '';
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
