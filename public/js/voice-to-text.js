document.getElementById('add-recipe-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const recipeName = document.getElementById('recipe-name').value;
    const recipeType = document.getElementById('recipe-type').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;

    // Send recipe data to backend
    fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: recipeName, type: recipeType, ingredients, instructions }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Recipe added successfully!');
    })
    .catch(err => console.error('Error:', err));

    this.reset();
});
