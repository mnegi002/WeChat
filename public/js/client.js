const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('msginp');
const messageContainer = document.querySelector('.container');

const append = (message, position, user = '') => {
    const messageElement = document.createElement('div');
    const userElement = document.createElement('span');
    const userName = document.createElement('b');

    userName.innerText = user;
    userElement.append(userName);

    if (user) {
        messageElement.append(userElement);
        messageElement.append(document.createElement('br'));
    }

    messageElement.append(message);
    messageElement.classList.add('msg');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
};

const user = prompt('Enter your name to join');

socket.on('connect', () => {
    socket.emit('new-user-joined', user);
});

socket.on('user-connected', user => {
    append(`${user} joined the chat`, 'middle');
});

socket.on('receive-message', data => {
    append(data.message, 'left', data.user);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(` ${message}`, 'right');
    socket.emit('send-message', { message: message });
    messageInput.value = '';
});

window.addEventListener('beforeunload', () => {
    if (socket.readyState === socket.OPEN) {
        socket.close();
    }
});
