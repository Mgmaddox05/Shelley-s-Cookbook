const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
