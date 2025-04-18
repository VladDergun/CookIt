document.addEventListener('DOMContentLoaded', () => {
    const recipeButtons = document.querySelectorAll('.recipe-link');

    recipeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const recipe = e.target.dataset.recipe;
            const difficulty = e.target.closest('.recipe-card').dataset.difficulty;
            
            alert(`Opening ${recipe} recipe (Difficulty: ${difficulty})`);
        });
    });
});
