document.getElementById('recipe-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const file = document.getElementById('file').files[0];

    if (file) {
        if (file.type === "application/pdf") {
            handlePDF(file);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            handleDOCX(file);
        } else {
            handleText(file);
        }
    }

    this.reset();
});

function handleText(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        displayRecipe(content);
    };
    reader.readAsText(file);
}

function handlePDF(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const typedArray = new Uint8Array(e.target.result);
        pdfjsLib.getDocument(typedArray).promise.then(pdf => {
            pdf.getPage(1).then(page => {
                page.getTextContent().then(textContent => {
                    let content = '';
                    textContent.items.forEach(item => {
                        content += item.str + ' ';
                    });
                    displayRecipe(content);
                });
            });
        });
    };
    reader.readAsArrayBuffer(file);
}

function handleDOCX(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        mammoth.extractRawText({arrayBuffer: arrayBuffer})
            .then(result => {
                const content = result.value;
                displayRecipe(content);
            })
            .catch(err => console.error(err));
    };
    reader.readAsArrayBuffer(file);
}

function displayRecipe(content) {
    const recipeList = document.getElementById('recipes-list');
    
    const nameMatch = content.match(/Name:\s*(.*)/);
    const typeMatch = content.match(/Type:\s*(.*)/);
    const ingredientsMatch = content.match(/Ingredients:\s*([\s\S]*?)\nInstructions:/);
    const instructionsMatch = content.match(/Instructions:\s*([\s\S]*)/);

    const name = nameMatch ? nameMatch[1] : "Unknown";
    const type = typeMatch ? typeMatch[1] : "Unknown";
    const ingredients = ingredientsMatch ? ingredientsMatch[1] : "Not provided";
    const instructions = instructionsMatch ? instructionsMatch[1] : "Not provided";

    const recipeItem = document.createElement('div');
    recipeItem.className = 'recipe-item';
    recipeItem.innerHTML = `
        <h4>${name}</h4>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Ingredients:</strong></p>
        <p>${ingredients.replace(/\n/g, '<br>')}</p>
        <p><strong>Instructions:</strong></p>
        <p>${instructions.replace(/\n/g, '<br>')}</p>
    `;
    
    recipeList.appendChild(recipeItem);
}
