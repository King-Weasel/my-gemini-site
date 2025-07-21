const submitButton = document.getElementById('submit-btn');
const promptInput = document.getElementById('prompt-input');
const responseArea = document.getElementById('response-area');

submitButton.addEventListener('click', async () => {
    const prompt = promptInput.value;
    if (!prompt) {
        alert('Please enter a prompt!');
        return;
    }

    // Disable the button and show a loading message
    submitButton.disabled = true;
    responseArea.innerText = 'Thinking...';

    try {
        // This is the key part: we call our backend function
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInput: prompt }),
        });

        if (!response.ok) {
            throw new Error('Something went wrong on the backend.');
        }

        const data = await response.json();
        responseArea.innerText = data.reply;

    } catch (error) {
        responseArea.innerText = 'Error: ' + error.message;
    } finally {
        // Re-enable the button
        submitButton.disabled = false;
    }
});