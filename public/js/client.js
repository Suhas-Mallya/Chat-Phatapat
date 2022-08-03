const socket = io();

let username;
let chats = document.querySelector(".chats");
let usersList = document.querySelector(".users-list");
let usersCount = document.querySelector(".users-count");
let msgSend = document.querySelector("#msg-send");
let userMsg = document.querySelector("#user-msg");


do {
    username = prompt("Enter your name : ");
}while(!username);

// It will be called when user will join
socket.emit("new-user-joined", username);

// notifying that user is joined
socket.on("user-connected", (socket_name) => {
    userJoinLeft(socket_name, ' joined the chat');
});

// function to create joined/left status 
function userJoinLeft(name, status) {
    let div = document.createElement("div");
    div.classList.add('user-join');
    let content = `<p><b>${name}</b>${status}</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

// notifying that user has left
socket.on("user-disconnected", (user) => {
    userJoinLeft(user,' left the chat')
});

// for updating users list and user controls
socket.on("user-list", (users) => {
    usersList.innerHTML = "";
    user_arr = Object.values(users);
    for(i=0; i<user_arr.length; i++) {
        let p = document.createElement("p");
        p.innerText = user_arr[i];
        usersList.appendChild(p);
    }
    usersCount.innerHTML = user_arr.length;
});

// for sending messages
msgSend.addEventListener('click', () => {
    let data = {
        user: username,
        msg: userMsg.value
    };
    if(userMsg.value != ' ') {
        appendMessage(data, 'outgoing');
        socket.emit('message', data);
        userMsg.value = '';
    }
});

function appendMessage(data, status) {
    let div = document.createElement("div");
    div.classList.add("message", status);
    let content =`
        <h5>${data.user}</h5>
        <p>${data.msg}</p>
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on('message', (data) => {
    appendMessage(data, 'incoming');
})