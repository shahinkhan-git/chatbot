// -------------------------
// DOM Elements
// -------------------------
const toggle = document.getElementById('chatbot-toggle');
const windowEl = document.getElementById('chatbot-window');
const closeBtn = document.getElementById('chatbot-close');
const messages = document.getElementById('chatbot-messages');
const buttonsContainer = document.getElementById('chatbot-buttons');

const messageSound = new Audio('assets/sounds/message-in.ogg');

let faqData = [];

// -------------------------
// Fetch FAQ Data
// -------------------------
fetch('data/faq.json')
  .then(res => res.json())
  .then(data => {
    faqData = data;
    showButtons();
    loadChatHistory(); // Load previous messages if any
  });

// -------------------------
// Event Listeners
// -------------------------
toggle.addEventListener('click', () => {
  windowEl.classList.toggle('hidden');
});

closeBtn.addEventListener('click', () => {
  windowEl.classList.add('hidden');
});

// -------------------------
// Show FAQ Buttons
// -------------------------
function showButtons() {
  buttonsContainer.innerHTML = '';
  faqData.forEach(item => {
    const btn = document.createElement('button');
    btn.textContent = item.question;
    btn.addEventListener('click', () => handleUserClick(item));
    buttonsContainer.appendChild(btn);
  });
}

// -------------------------
// Handle User Click
// -------------------------
function handleUserClick(item) {
  addMessage(item.question, 'user');
  addBotMessage(item.answer);
  saveChatHistory(); // Save every interaction
}

// -------------------------
// Add Message
// -------------------------
function addMessage(text, sender) {
  const msg = document.createElement('div');
  msg.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
  msg.textContent = text;
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

// -------------------------
// Add Bot Message with Typing
// -------------------------
function addBotMessage(text) {
  const msg = document.createElement('div');
  msg.classList.add('bot-message', 'typing');
  msg.textContent = '';
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;

  let i = 0;
  const typingSpeed = 30; // ms per character

  const typeInterval = setInterval(() => {
    if (i < text.length) {
      msg.textContent += text.charAt(i);
      i++;
      messages.scrollTop = messages.scrollHeight;
    } else {
      clearInterval(typeInterval);
      msg.classList.remove('typing');
      messageSound.play();
      saveChatHistory(); // Save after bot finishes typing
    }
  }, typingSpeed);
}

// -------------------------
// Session Storage
// -------------------------
function saveChatHistory() {
  const chatHTML = messages.innerHTML;
  sessionStorage.setItem('chatHistory', chatHTML);
}

function loadChatHistory() {
  const saved = sessionStorage.getItem('chatHistory');
  if (saved) {
    messages.innerHTML = saved;
    messages.scrollTop = messages.scrollHeight;
  }
}
