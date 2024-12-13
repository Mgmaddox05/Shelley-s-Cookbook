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
    const allList = document.getElementById('recipes-list');
    const breakfastList = document.getElementById('breakfast-list');
    const lunchList = document.getElementById('lunch-list');
    const dinnerList = document.getElementById('dinner-list');
    const dessertList = document.getElementById('dessert-list');

    const recipeItem = document.createElement('li');
    recipeItem.className = 'recipe-item';
    recipeItem.textContent = content;

    // Add to "All" category
    allList.appendChild(recipeItem.cloneNode(true));

    // Categorize based on a simple keyword check in content (e.g., breakfast, lunch, dinner, dessert)
    if (/breakfast/i.test(content)) {
        breakfastList.appendChild(recipeItem.cloneNode(true));
    } else if (/lunch/i.test(content)) {
        lunchList.appendChild(recipeItem.cloneNode(true));
    } else if (/dinner/i.test(content)) {
        dinnerList.appendChild(recipeItem.cloneNode(true));
    } else if (/dessert/i.test(content)) {
        dessertList.appendChild(recipeItem.cloneNode(true));
    }
}

// Initialize SortableJS for each list
new Sortable(document.getElementById('recipes-list'), {
    animation: 150,
    ghostClass: 'sortable-ghost'
});

new Sortable(document.getElementById('breakfast-list'), {
    animation: 150,
    ghostClass: 'sortable-ghost'
});

new Sortable(document.getElementById('lunch-list'), {
    animation: 150,
    ghostClass: 'sortable-ghost'
});

new Sortable(document.getElementById('dinner-list'), {
    animation: 150,
    ghostClass: 'sortable-ghost'
});

new Sortable(document.getElementById('dessert-list'), {
    animation: 150,
    ghostClass: 'sortable-ghost'
});

function openCategory(evt, categoryName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(categoryName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Open default tab
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.tablinks').click();
});
