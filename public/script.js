const socket = io();

const namePrompt = document.getElementById('name-prompt');
const nameInput = document.getElementById('username');
const submitNameBtn = document.getElementById('submit-name');
const chat = document.getElementById('chat');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let username = null;

function showChat() {
    namePrompt.classList.add('hidden');
    chat.classList.remove('hidden');
    messages.scrollTop = messages.scrollHeight;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMessage(msg) {
    const item = document.createElement('li');
    if (msg.system) {
        item.textContent = `* ${msg.text}`;
        item.classList.add('system-msg');
    } else {
        const time = formatTime(msg.time);
        item.innerHTML = `<span class="username">${msg.name}</span> <span class="time">${time}</span><br>${msg.text}`;
    }
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
}

submitNameBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) return;
    socket.emit('set name', name, (success) => {
        username = name;
        showChat();
    });
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    if (text.length > 250) return alert("Message too long (max 250 characters)");
    socket.emit('chat message', text);
    input.value = '';
});

socket.on('chat history', (history) => {
    history.forEach(addMessage);
});

socket.on('chat message', (msg) => {
    addMessage(msg);
});
