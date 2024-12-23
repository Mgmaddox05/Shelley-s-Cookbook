document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/api/recipes');
      const recipes = await response.json();
      displayRecipes(recipes);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    }
  });
  
  function displayRecipes(recipes) {
    const allList = document.getElementById('recipes-list');
    const breakfastList = document.getElementById('breakfast-list');
    const lunchList = document.getElementById('lunch-list');
    const dinnerList = document.getElementById('dinner-list');
    const dessertList = document.getElementById('dessert-list');
  
    recipes.forEach(recipe => {
      const listItem = document.createElement('li');
      listItem.textContent = recipe.name;
  
      allList.appendChild(listItem);
  
      switch (recipe.type.toLowerCase()) {
        case 'breakfast':
          breakfastList.appendChild(listItem.cloneNode(true));
          break;
        case 'lunch':
          lunchList.appendChild(listItem.cloneNode(true));
          break;
        case 'dinner':
          dinnerList.appendChild(listItem.cloneNode(true));
          break;
        case 'dessert':
          dessertList.appendChild(listItem.cloneNode(true));
          break;
      }
    });
  }
  