function messageBase(variant) {
    const recipes = {
        "Classic Lasagna": "Nice choice! 🍝 Prepare a rich meat sauce by browning ground beef 🥩 with onions 🧅 and garlic 🧄, then simmer with tomato sauce 🍅 and Italian herbs 🌿. Layer cooked lasagna noodles 🍜 with meat sauce, ricotta cheese 🧀, and mozzarella 🧀 in a baking dish. Repeat layers and top with cheese. Bake at 180°C (350°F) 🔥 for about 45 minutes until bubbly and golden. Let it rest for 10 minutes before serving. 😋",
        
        "Pizza Quattro Formaggi": "Nice choice! 🍕\nPreheat oven to 180°C (350°F) 🔥.\nMix 1 cup shredded mozzarella 🧀, 1/2 cup shredded Parmesan 🧀, 1/2 cup shredded Asiago 🧀, and 1/2 cup shredded pecorino 🧀.\nPlace pizza dough on a baking sheet.\nSpread tomato sauce 🍅 evenly.\nSprinkle cheese mixture evenly.\nBake for 12-15 minutes or until cheese is melted and bubbly. 🤤\nLet cool slightly before serving.",
        
        "Pasta Carbonara": "Nice choice! 🍝\nCook 1 pound pasta 🍜 in salted boiling water.\nIn a bowl, whisk 4 eggs 🥚, 1/2 cup grated Parmesan 🧀, 1/2 cup grated pecorino 🧀, 1/2 cup grated Asiago 🧀, and 1/2 cup grated mozzarella 🧀.\nDrain pasta, reserving 1 cup pasta water.\nIn a skillet, cook 2 cloves garlic 🧄, 1/2 cup pancetta 🥓, 1/2 cup butter 🧈, and 1/2 cup white wine 🍷.\nAdd pasta, pasta water, and egg mixture.\nCook until pasta is tender and sauce is creamy. 😍\nSeason with salt 🧂 and pepper.\nServe hot, garnished with grated Parmesan 🧀."
    }
    

    const cookingTips = [
        "1. Use fresh ingredients",
        "2. Don't rush",
        "3. Clean up as you go"
    ]

    const foodFacts = [
        "1. 100g of pasta contains 100 calories",
        "2. 100g of beef contains 250 calories",
        "3. 100g of chicken contains 160 calories"
    ]

    switch(variant) {
        case "Recipes":
            return recipes;
        case "Tips":
            return cookingTips;
        case "Facts":
            return foodFacts;
        case "options":
            return ["1. Recipes", "2. Tips", "3. Facts"];
        default:
            return null;
    }
}


document.addEventListener('DOMContentLoaded', () => {
   const dialogWindow = document.querySelector('.dialog-window'); 
   const closeButton = dialogWindow.querySelector('.dialog-close');
   const messages = dialogWindow.querySelector('.dialog-messages');
   const input = document.getElementById('chatbot-user-input');
   const sendButton = document.getElementById('chatbot-send-button');

   let isInitialized = false;

   dialogWindow.addEventListener('click', () => {
    if(dialogWindow.classList.contains('closed')){
        dialogWindow.classList.remove('closed');
        if(!isInitialized) {
            initChat();
            isInitialized = true;
        }
    }
   });

    closeButton.addEventListener('click', (event) => {
    event.stopPropagation();
    dialogWindow.classList.add('closed');
    });


    sendButton.addEventListener('click', () => {
        const message = input.value.trim();
        if(message){
            sendMessage(message);
        }
    });

    input.addEventListener('keypress', (event) => {
        if(event.key === 'Enter') {
            sendButton.click();
        }
    });


    async function initChat() {
        await new Promise(resolve => setTimeout(resolve, 100));
        await showAuthorInformation('Vladyslav', 'Derhun');
        showOptions();
    }
    
    async function receiveMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'received');
        messageElement.textContent = '';
        messages.appendChild(messageElement);
        
        for (let i = 0; i < message.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 30));
            messageElement.textContent += message[i];
        }
        
    }
    
    function sendMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'sent');
        messageElement.textContent = message;
        messages.appendChild(messageElement);
        input.value = '';

        processMessage(message);

        return message;
    }

    let currentState = 'initial';
    let currentOptions = null;

    async function processMessage(message) {
        const sanitizedMessage = message.replace(/[^\w\s]/gi, '').toLowerCase();
        
        if (currentState === 'initial') {
            if (sanitizedMessage.includes('recipes')) {
                currentState = 'recipes';
                currentOptions = messageBase('Recipes');
                const recipeList = Object.keys(currentOptions).join('\n');
                await receiveMessage('Please choose one of these recipes:\n' + recipeList);
            } else if (sanitizedMessage.includes('tips')) {
                currentState = 'tips';
                currentOptions = messageBase('Tips');
                await receiveMessage(currentOptions.join('\n'));
                currentState = 'initial';
                await showOptions();
            } else if (sanitizedMessage.includes('facts')) {
                currentState = 'facts';
                currentOptions = messageBase('Facts');
                await receiveMessage(currentOptions.join('\n'));
                currentState = 'initial';
                await showOptions();
            }
            else {
                await receiveMessage("I can't answer that.");
                await showOptions();
            }
        } else if (currentState === 'recipes') {
            const selectedRecipe = Object.keys(currentOptions).find(recipe => 
                sanitizedMessage.includes(recipe.toLowerCase())
            );

            if (selectedRecipe) {
                await receiveMessage(`${currentOptions[selectedRecipe]}`);
                currentState = 'initial';
                await showOptions();
            } else {
                await receiveMessage("I don't know that recipe.");
            }
        }
    }

    async function showOptions() {
        await receiveMessage('Please choose one of these options:\n');
        await receiveMessage(messageBase('options').join('\n'));
    }

    async function showAuthorInformation(firstName, lastName, position = "Software Engineer") {
        await receiveMessage(`I am ${firstName} ${lastName}, a ${position}.`);
    }
});


