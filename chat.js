document.addEventListener('DOMContentLoaded', () => {
    const chatToggleButton = document.getElementById('chat-toggle-button');
    const chatContainer = document.getElementById('chat-container');
    const chatCloseButton = document.getElementById('chat-close-button');
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.getElementById('chat-send-button');
    const chatMessages = document.getElementById('chat-messages');

    // Mostrar/Ocultar el chat
    chatToggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('hidden');
        chatToggleButton.classList.toggle('hidden');
    });

    chatCloseButton.addEventListener('click', () => {
        chatContainer.classList.add('hidden');
        chatToggleButton.classList.remove('hidden');
    });

    // Enviar mensaje
    chatSendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        addMessage(userMessage, 'user');
        chatInput.value = '';

        // Muestra un indicador de "escribiendo..."
        addTypingIndicator();

        // Llama al backend para obtener la respuesta de Gemini
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        })  
        .then(response => response.json())
        .then(data => {
            removeTypingIndicator(); // Quita el indicador
            addMessage(data.reply, 'bot');
        })
        .catch(error => {
            removeTypingIndicator(); // Quita el indicador
            addMessage('Lo siento, no puedo responder en este momento.', 'bot');
            console.error('Error al contactar al servidor:', error);
        });
    }

    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll hacia abajo
    }

    function addTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.classList.add('chat-message', 'bot-message');
        typingElement.textContent = '...';
        chatMessages.appendChild(typingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }
});
