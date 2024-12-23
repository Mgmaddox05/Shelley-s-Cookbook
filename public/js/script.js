document.getElementById('recipe-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const ingredients = document.getElementById('ingredients').value;
    const instructions = document.getElementById('instructions').value;

    const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            type: type,
            ingredients: ingredients,
            instructions: instructions
        })
    });

    if (response.ok) {
        alert('Recipe added successfully!');
    } else {
        alert('Failed to add recipe');
    }
});
