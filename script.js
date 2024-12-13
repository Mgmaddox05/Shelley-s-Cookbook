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

    const recipeItem = document.createElement('li');
    recipeItem.className = 'recipe-item';
    recipeItem.textContent = content;
    
    recipeList.appendChild(recipeItem);
}

// Initialize SortableJS
new Sortable(document.getElementById('recipes-list'), {
    animation: 150,
    ghostClass: 'sortable-ghost'
});
