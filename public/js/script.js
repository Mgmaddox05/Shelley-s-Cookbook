document.getElementById('recipe-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const file = document.getElementById('file').files[0];
    const imageFile = document.getElementById('image').files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            if (imageFile) {
                const imageReader = new FileReader();
                imageReader.onload = function(e) {
                    const imageUrl = e.target.result;
                    displayRecipe(content, imageUrl);
                };
                imageReader.readAsDataURL(imageFile);
            } else {
                displayRecipe(content, null);
            }
        };

        if (file.type === "application/pdf") {
            reader.onload = function(e) {
                const typedArray = new Uint8Array(e.target.result);
                pdfjsLib.getDocument(typedArray).promise.then(pdf => {
                    pdf.getPage(1).then(page => {
                        page.getTextContent().then(textContent => {
                            let content = '';
                            textContent.items.forEach(item => {
                                content += item.str + ' ';
                            });
                            if (imageFile) {
                                const imageReader = new FileReader();
                                imageReader.onload = function(e) {
                                    const imageUrl = e.target.result;
                                    displayRecipe(content, imageUrl);
                                };
                                imageReader.readAsDataURL(imageFile);
                            } else {
                                displayRecipe(content, null);
                            }
                        });
                    });
                });
            };
            reader.readAsArrayBuffer(file);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            reader.onload = function(e) {
                const arrayBuffer = e.target.result;
                mammoth.extractRawText({arrayBuffer: arrayBuffer})
                    .then(result => {
                        const content = result.value;
                        if (imageFile) {
                            const imageReader = new FileReader();
                            imageReader.onload = function(e) {
                                const imageUrl = e.target.result;
                                displayRecipe(content, imageUrl);
                            };
                            imageReader.readAsDataURL(imageFile);
                        } else {
                            displayRecipe(content, null);
                        }
                    })
                    .catch(err => console.error(err));
            };
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    }
    this.reset();
});

function displayRecipe(content, imageUrl) {
    const allList = document.getElementById('recipes-list');
    const breakfastList = document.getElementById('breakfast-list');
    const lunchList = document.getElementById('lunch-list');
    const dinnerList = document.getElementById('dinner-list');
    const dessertList = document.getElementById('dessert-list');

    const recipeItem = document.createElement('li');
    recipeItem.className = 'recipe-item';
    
    if (imageUrl) {
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        recipeItem.appendChild(imageElement);
    }

    const textElement = document.createElement('div');
    textElement.textContent = content;
    recipeItem.appendChild(textElement);

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
['recipes-list', 'breakfast-list', 'lunch-list', 'dinner-list', 'dessert-list'].forEach(id => {
    new Sortable(document.getElementById(id), {
        animation: 150,
        ghostClass: 'sortable-ghost'
    });
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
