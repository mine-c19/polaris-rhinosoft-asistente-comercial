const ASSISTANT_NAME = "Asistente Comercial RhinoSoft";
const REQUEST_TIMEOUT_MS = 60_000;

const assistantNameElement = document.querySelector("#assistant-name");
const messagesElement = document.querySelector("#messages");
const emptyStateElement = document.querySelector("#empty-state");
const formElement = document.querySelector("#chat-form");
const inputElement = document.querySelector("#message-input");
const sendButton = document.querySelector("#send-button");
const newConversationButton = document.querySelector("#new-conversation");
const typingIndicator = document.querySelector("#typing-indicator");
const characterCount = document.querySelector("#character-count");
const dictateButton = document.querySelector("#dictate-button");
const voiceStatus = document.querySelector("#voice-status");

assistantNameElement.textContent = ASSISTANT_NAME;

let conversationId = null;
let requestController = null;
let requestSequence = 0;
let isWaiting = false;
let activeRecognition = null;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition || null;
const canDictate =
  typeof SpeechRecognition === "function" &&
  typeof SpeechRecognition.prototype.start === "function";
const canSpeak =
  typeof window.speechSynthesis !== "undefined" &&
  typeof window.SpeechSynthesisUtterance === "function";

if (canDictate) {
  dictateButton.hidden = false;
}

function scrollMessagesToEnd() {
  messagesElement.scrollTop = messagesElement.scrollHeight;
}

function updateSendButton() {
  sendButton.disabled = isWaiting || inputElement.value.trim().length === 0;
}

function updateCharacterCount() {
  characterCount.textContent = `${inputElement.value.length}/2000`;
  updateSendButton();
}

function stopSpeech() {
  if (canSpeak) {
    window.speechSynthesis.cancel();
  }
}

function addMessage(role, text, isError = false) {
  emptyStateElement.hidden = true;

  const messageElement = document.createElement("article");
  messageElement.classList.add("message", `message-${role}`);
  if (isError) {
    messageElement.classList.add("message-error");
    messageElement.setAttribute("role", "alert");
  }

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = role === "user" ? "Tú" : ASSISTANT_NAME;

  const bubble = document.createElement("p");
  bubble.className = "message-bubble";
  bubble.textContent = text;

  messageElement.append(label, bubble);

  if (role === "assistant" && !isError && canSpeak) {
    const listenButton = document.createElement("button");
    listenButton.className = "listen-button";
    listenButton.type = "button";
    listenButton.textContent = "Escuchar";
    listenButton.setAttribute("aria-label", `Escuchar respuesta de ${ASSISTANT_NAME}`);
    listenButton.addEventListener("click", () => {
      stopSpeech();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = "es-MX";
      window.speechSynthesis.speak(utterance);
    });
    messageElement.append(listenButton);
  }

  messagesElement.append(messageElement);
  scrollMessagesToEnd();
}

function setWaiting(waiting) {
  isWaiting = waiting;
  typingIndicator.hidden = !waiting;
  updateSendButton();
  if (waiting) {
    scrollMessagesToEnd();
  }
}

function stopRecognition() {
  if (activeRecognition) {
    activeRecognition.stop();
    activeRecognition = null;
  }
  dictateButton.setAttribute("aria-pressed", "false");
}

function startDictation() {
  if (activeRecognition) {
    stopRecognition();
    return;
  }

  voiceStatus.textContent = "";
  const recognition = new SpeechRecognition();
  activeRecognition = recognition;
  recognition.lang = "es-MX";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  dictateButton.setAttribute("aria-pressed", "true");

  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0]?.[0]?.transcript?.trim();
    if (!transcript) return;

    const separator =
      inputElement.value.length > 0 && !/\s$/u.test(inputElement.value) ? " " : "";
    inputElement.value = `${inputElement.value}${separator}${transcript}`.slice(0, 2000);
    updateCharacterCount();
    inputElement.focus();
  });

  recognition.addEventListener("error", () => {
    voiceStatus.textContent = "No se pudo reconocer la voz. Puedes escribir tu mensaje.";
  });

  recognition.addEventListener("end", () => {
    if (activeRecognition === recognition) {
      activeRecognition = null;
    }
    dictateButton.setAttribute("aria-pressed", "false");
  });

  try {
    recognition.start();
  } catch {
    activeRecognition = null;
    dictateButton.setAttribute("aria-pressed", "false");
    voiceStatus.textContent = "No se pudo iniciar el dictado. Inténtalo de nuevo.";
  }
}

function startNewConversation() {
  requestSequence += 1;
  if (requestController) {
    requestController.abort();
    requestController = null;
  }
  stopRecognition();
  stopSpeech();
  conversationId = null;
  inputElement.value = "";
  updateCharacterCount();
  voiceStatus.textContent = "";
  setWaiting(false);
  messagesElement.replaceChildren(emptyStateElement);
  emptyStateElement.hidden = false;
  scrollMessagesToEnd();
  inputElement.focus();
}

async function sendMessage() {
  const message = inputElement.value.trim();
  if (message.length === 0 || message.length > 2000 || isWaiting) return;

  stopRecognition();
  stopSpeech();
  addMessage("user", message);
  inputElement.value = "";
  updateCharacterCount();
  voiceStatus.textContent = "";

  const currentSequence = ++requestSequence;
  const controller = new AbortController();
  requestController = controller;
  let timedOut = false;
  const timeoutId = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  setWaiting(true);

  try {
    const requestBody = { message };
    if (conversationId) {
      requestBody.conversation_id = conversationId;
    }

    const result = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
    let payload = null;
    try {
      payload = await result.json();
    } catch {
      payload = null;
    }

    if (currentSequence !== requestSequence) return;

    if (!result.ok) {
      const detail =
        typeof payload?.detail === "string"
          ? payload.detail
          : "No se pudo procesar el mensaje. Inténtalo de nuevo.";
      addMessage("assistant", detail, true);
      return;
    }

    if (
      typeof payload?.reply !== "string" ||
      typeof payload?.conversation_id !== "string"
    ) {
      addMessage(
        "assistant",
        "El servidor devolvió una respuesta no válida. Inténtalo de nuevo.",
        true,
      );
      return;
    }

    conversationId = payload.conversation_id;
    addMessage("assistant", payload.reply);
  } catch (error) {
    if (currentSequence !== requestSequence) return;
    if (error?.name === "AbortError" && timedOut) {
      addMessage(
        "assistant",
        "La solicitud tardó más de 60 segundos y se canceló. Inténtalo de nuevo.",
        true,
      );
    } else if (error?.name !== "AbortError") {
      addMessage(
        "assistant",
        "No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.",
        true,
      );
    }
  } finally {
    window.clearTimeout(timeoutId);
    if (currentSequence === requestSequence) {
      requestController = null;
      setWaiting(false);
      inputElement.focus();
    }
  }
}

inputElement.addEventListener("input", updateCharacterCount);
inputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    if (!sendButton.disabled) {
      formElement.requestSubmit();
    }
  }
});
formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  void sendMessage();
});
newConversationButton.addEventListener("click", startNewConversation);
if (canDictate) {
  dictateButton.addEventListener("click", startDictation);
}

updateCharacterCount();
