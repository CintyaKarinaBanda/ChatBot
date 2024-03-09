const socket = io();

const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');

const mostrarMensaje = (mensaje, esUsuario = false) => {
    const mensajeElement = document.createElement('p');
    mensajeElement.innerHTML = mensaje;
    mensajeElement.classList.add(esUsuario ? 'user-message' : 'bot-message');
    chatBody.appendChild(mensajeElement);
};

const manejarRespuesta = (respuestas) => {
    respuestas.forEach((respuesta) => {
        setTimeout(() => {
            mostrarMensaje(respuesta, false);
        }, 1000);
    });
};

userInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        const userMessage = event.target.value;
        mostrarMensaje(userMessage, true);
        socket.emit('respuesta', userMessage);
        userInput.value = '';
        
    }
});

socket.on('respuesta-bot', manejarRespuesta);
socket.emit('iniciar-conversacion');