document.addEventListener('DOMContentLoaded', ()=>{
    const recipesPopupOverlay = document.querySelector('.recipe-popup-overlay');
    if(!recipesPopupOverlay){
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'recipe-popup-overlay';

        popupOverlay.innerHTML = `
        <div class="recipe-popup">
            <button class="recipe-popup-close">&times;</button>
            <div class="recipe-popup-header">
                <img src="" alt="">
                <div class="recipe-popup-title">
                    <h2></h2>
                    <div class="recipe-popup-meta">
                        <span class="recipe-difficulty-badge"></span>
                        <span><i class="icon">⏱️</i> Prep: <strong></strong></span>
                        <span><i class="icon">🍳</i> Cook: <strong></strong></span>
                    </div>
                </div>
            </div>
            <div class="recipe-popup-content">
                <div class="recipe-popup-description"></div>
                
                <div class="recipe-popup-section">
                    <h3>Ingredients</h3>
                    <div class="recipe-popup-ingredients"></div>
                </div>
                
                <div class="recipe-popup-section">
                    <h3>Instructions</h3>
                    <div class="recipe-popup-instructions"></div>
                </div>
            </div>
        </div>
    `;

        document.body.appendChild(popupOverlay);

        const closeButton = popupOverlay.querySelector('.recipe-popup-close');
        closeButton.addEventListener('click', () => {
            popupOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    createRecipeCards();

    const recipeCardContainer = document.querySelector('.recipes-section') || document.querySelector('.best-recipes');
    if (!recipeCardContainer) return;

    recipeCardContainer.addEventListener('click', (event) => {

        if(event.target.dataset.recipeOpen !== undefined){
            const recipeKey = event.target.dataset.recipe;
            const recipeCardsInfo = window.recipeData;
            if (recipeCardsInfo && recipeKey) {
                openRecipePopup(recipeCardsInfo[recipeKey]);
            }
        }

        if(event.target.dataset.recipeLike !== undefined){
            event.target.classList.toggle('liked');
        }
    });


    function openRecipePopup(recipe) {
        const popupOverlay = document.querySelector('.recipe-popup-overlay');
        const popup = popupOverlay.querySelector('.recipe-popup');
        
        const headerImg = popup.querySelector('.recipe-popup-header img');
        headerImg.src = recipe.image;
        headerImg.alt = recipe.name;
        popup.querySelector('.recipe-popup-title h2').textContent = recipe.name;
        

        const difficultyBadge = popup.querySelector('.recipe-difficulty-badge');

        difficultyBadge.textContent = recipe.difficulty;
        difficultyBadge.className = 'recipe-difficulty-badge ' + recipe.difficulty;
        

        const metaInfo = popup.querySelectorAll('.recipe-popup-meta strong');
        metaInfo[0].textContent = recipe.prepTime;
        metaInfo[1].textContent = recipe.cookTime;
        
        
        popup.querySelector('.recipe-popup-description').textContent = recipe.description;
        
        const ingredientsContainer = popup.querySelector('.recipe-popup-ingredients');
        ingredientsContainer.innerHTML = '';
        recipe.ingredients.forEach(ingredient => {
            const ingredientEl = document.createElement('div');
            ingredientEl.className = 'recipe-popup-ingredient';
            ingredientEl.textContent = ingredient;
            ingredientsContainer.appendChild(ingredientEl);
        }); 

        const instructionsContainer = popup.querySelector('.recipe-popup-instructions');
        instructionsContainer.innerHTML = '';
        recipe.instructions.forEach((instruction) => {
            const instructionEl = document.createElement('div');
            instructionEl.className = 'recipe-popup-instruction';
            instructionEl.textContent = instruction;
            instructionsContainer.appendChild(instructionEl);
        });

        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    async function createRecipeCards() {
        try {
            const recipeCardsInfo = await fetch('assets/js/recipes-data.json').then(response => response.json());
            
            window.recipeData = recipeCardsInfo;

            const isBestRecipesSection = document.querySelector('.best-recipes') !== null;
            const isRecipesSection = document.querySelector('.recipes-section') !== null;
            
            if (isBestRecipesSection) {
                const bestRecipesContainer = document.createElement('div');
                bestRecipesContainer.className = 'recipes-container';

                Object.keys(recipeCardsInfo).forEach(recipeKey => {
                    const recipe = recipeCardsInfo[recipeKey];
                    if (recipe.isbest) {
                        const recipeCard = createRecipeCard(recipe, recipeKey);
                        bestRecipesContainer.appendChild(recipeCard);
                    }
                });
                
                const bestRecipesSection = document.querySelector('.best-recipes');
                if (bestRecipesSection) {
                    bestRecipesSection.appendChild(bestRecipesContainer);
                }
            }
            
            if (isRecipesSection) {
                const allRecipesContainer = document.createElement('div');
                allRecipesContainer.className = 'recipes-container';
                
                Object.keys(recipeCardsInfo).forEach(recipeKey => {
                    const recipe = recipeCardsInfo[recipeKey];
                    const recipeCard = createRecipeCard(recipe, recipeKey);
                    allRecipesContainer.appendChild(recipeCard);
                });
                
                const recipesSection = document.querySelector('.recipes-section');
                if (recipesSection) {
                    recipesSection.appendChild(allRecipesContainer);
                }
            }
        } catch (error) {
            console.error('Error loading recipes:', error);
        }
    }
    
    function createRecipeCard(recipe, recipeKey) {
        const recipeCard = document.createElement('article');
        recipeCard.className = 'recipe-card';
        recipeCard.dataset.difficulty = recipe.difficulty;
        recipeCard.dataset.recipe = recipeKey;
        
        recipeCard.innerHTML = `
            <div class="recipe-image-container">
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                <span class="recipe-difficulty">${recipe.difficulty}</span>
                <button class="recipe-like-btn" data-recipe-like></button>
            </div>
            <div class="recipe-content">
                <h3>${recipe.name}</h3>
                <p class="recipe-info">Preparation: <b>${recipe.prepTime}</b></p>
                <button class="recipe-open-btn" data-recipe="${recipeKey}" data-recipe-open>View Recipe</button>
            </div>
        `;
        return recipeCard;
    }


});