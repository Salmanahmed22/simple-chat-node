const socket = io();

import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

//* Helper Functions *//

function generateUsername() {
  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "",
    length: 2,
    style: "capital",
  });

  const number = Math.floor(Math.random() * 1000);
  return `${randomName}${number}`;
}

function joinChat(username) {
  document.getElementById("username").textContent = username;
  socket.emit("join", username);
}

function sendMessage(message) {
  socket.emit("chatMessage", message);
  document.getElementById("messageInput").value = "";
}

//* Event Listeners *//

document.getElementById("sendButton").addEventListener("click", () => {
  const message = document.getElementById("messageInput").value;
  sendMessage(message);
});

document.getElementById("messageInput").addEventListener("input", () => {
  socket.emit("typing");
});

document.getElementById("messageInput").addEventListener("keydown", (event) => {
  const message = document.getElementById("messageInput").value;
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage(message);
  }
});


//* Socket Events *//

socket.on("message", (message, username) => {
  const messages = document.getElementById("messages");
  const newMessage = document.createElement("div");
  if(username === myusername){
    message = `You: ${message}`
    newMessage.classList = "my-message";
  }else{
    message = `${username}: ${message}`
    newMessage.classList = "other-message";
  }
  newMessage.textContent = message;
  messages.appendChild(newMessage);
  messages.scrollTop =
    messages.scrollHeight;
});

socket.on("newUser", (username) => {
  const message = `${username} joined`;
  const messages = document.getElementById("messages");
  const newMassege = document.createElement("div")
  newMassege.textContent = message;
  newMassege.classList.add("notification");
  messages.appendChild(newMassege);
});

socket.on("userLeft", (username) => {
  console.log("userLeft", username);
  const massage = `${username} left`;
  const massages = document.getElementById("messages");
  const newMassage = document.createElement("div");
  newMassage.textContent = massage;
  newMassage.classList.add("notification");
  massages.appendChild(newMassage);
  massages.scrollTop =
    massages.scrollHeight;
})

socket.on("newtyping", (username) => {
  console.log(`${username} is typing...`);
    const typing = document.getElementById("typing");
    typing.textContent = `${username} is typing...`;
  
  setTimeout(() => {
    console.log("aaaaaaaaaaaaaaaa");
    typing.textContent = "";
  }, 1000)
});

//* Initialize Chat *//

const myusername = generateUsername();
joinChat(myusername);
