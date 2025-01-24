const currentUserKey = "currentUser";
const messagesKey = "chatMessages";

const users = ["Muhammad", "Sadullayev"];

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem(currentUserKey)) {
    localStorage.setItem(currentUserKey, users[0]);
  }
  loadChat();
  updateUserProfile();
});

function switchUser() {
  let currentUser = localStorage.getItem(currentUserKey);
  let newUser = currentUser === users[0] ? users[1] : users[0];
  localStorage.setItem(currentUserKey, newUser);
  updateUserProfile();
  loadChat();
}

function updateUserProfile() {
  let currentUser = localStorage.getItem(currentUserKey);
  let profileImage = document.querySelector(".chat-header img");
  let chatHeader = document.getElementById("chat-header");

  if (currentUser === "Muhammad") {
    chatHeader.innerText = "Sadullayev"; 
    profileImage.src = "./img/images.png"; 
  } else {
    chatHeader.innerText = "Muhammad";
    profileImage.src = "./img/download.jpg";
  }
}

function sendMessage() {
  const input = document.getElementById("message-input");
  const messageText = input.value.trim();

  if (messageText === "") return;

  let currentUser = localStorage.getItem(currentUserKey);
  let recipient = currentUser === users[0] ? users[1] : users[0];
  let messages = JSON.parse(localStorage.getItem(messagesKey)) || [];

  let now = new Date();
  let hours = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");
  let formattedTime = `${hours}:${minutes}`;

  messages.push({
    sender: currentUser,
    receiver: recipient,
    text: messageText,
    timestamp: formattedTime,
  });

  localStorage.setItem(messagesKey, JSON.stringify(messages));
  input.value = "";
  loadChat();
}

function loadChat() {
  let messages = JSON.parse(localStorage.getItem(messagesKey)) || [];
  let currentUser = localStorage.getItem(currentUserKey);
  let recipient = currentUser === users[0] ? users[1] : users[0];
  let chatBox = document.getElementById("messages");

  chatBox.innerHTML = "";

  messages.forEach((msg, index) => {
    if (
      (msg.sender === currentUser && msg.receiver === recipient) ||
      (msg.sender === recipient && msg.receiver === currentUser)
    ) {
      let messageDiv = document.createElement("div");
      messageDiv.classList.add("message");

      if (msg.sender === currentUser) {
        messageDiv.classList.add("sent");
      } else {
        messageDiv.classList.add("received");
      }

      messageDiv.innerHTML = `
          <strong>${msg.sender}:</strong> ${msg.text} 
          <span class="timestamp">${msg.timestamp}</span>
          <span class="delete-icon" onclick="deleteMessage(${index})">&#128465;</span>
        `;

      chatBox.appendChild(messageDiv);
    }
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

function deleteMessage(index) {
  let messages = JSON.parse(localStorage.getItem(messagesKey)) || [];
  messages.splice(index, 1);
  localStorage.setItem(messagesKey, JSON.stringify(messages));
  loadChat();
}

setInterval(loadChat, 2000);
