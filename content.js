// Constants
const POPUP_ID = "explainPopup";
const EXPLAIN_BTN_ID = "explainBtn";
const CLOSE_BTN_ID = "closeBtn";
const EXPLANATION_CONTENT_ID = "explanationContent";
const USER_KEY = "userKey";
const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

// Storage helpers
const storage = {
  get: (key) => chrome.storage.local.get(key).then((data) => data[key]),
  set: async (key, value) => {
    try {
      await chrome.storage.local.set({ [key]: value });
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  },
};

// API key management
const apiKeyManager = {
  encrypt: (apiKey) => btoa(encodeURIComponent(apiKey + USER_KEY)),
  decrypt: (encryptedKey) => {
    const fullKey = decodeURIComponent(atob(encryptedKey));
    return fullKey.replace(USER_KEY, "");
  },
  get: () =>
    storage
      .get("apiKey")
      .then((key) => (key ? apiKeyManager.decrypt(key) : null)),
  set: (apiKey) => storage.set("apiKey", apiKeyManager.encrypt(apiKey)),
  prompt: async () => {
    const apiKey = prompt("Please enter your OpenAI API key");
    if (apiKey) await apiKeyManager.set(apiKey);
    return apiKey;
  },
};

// UI helpers
let previousSelection = "";
const ui = {
  createPopup: async () => {
    console.log("Creating popup...");

    // Fetch the popup.html file content
    const response = await fetch(chrome.runtime.getURL("popup.html"));
    const popupHtml = await response.text();

    // Create a container div and load the HTML content into it
    const popupContainer = document.createElement("div");
    popupContainer.innerHTML = popupHtml;

    // Find the actual popup div from the fetched HTML
    const popup = popupContainer.querySelector(".popup");
    if (!popup) {
      console.error("Popup HTML structure not found in popup.html");
      return;
    }

    // Append the popup to the body
    document.body.appendChild(popup);
    console.log("Popup created and appended to body");

    ui.setupEventListeners();
    return popup;
  },

  setupEventListeners: () => {
    console.log("Setting up event listeners...");

    const explainBtn = document.getElementById("explainBtn");
    const closeBtn = document.getElementById("closeBtn");

    if (explainBtn) {
      explainBtn.onclick = handleExplainClick;
      console.log("Explain button listener set");
    } else {
      console.error("Explain button not found");
    }

    if (closeBtn) {
      closeBtn.onclick = () => {
        document.querySelector(".popup").remove();
        previousSelection = "";
        console.log("Popup removed");
      };
      console.log("Close button listener set");
    } else {
      console.error("Close button not found");
    }
  },
  positionPopup: (popup, rect) => {
    console.log("Positioning popup...");

    if (!rect) {
      Object.assign(popup.style, {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      });
      console.log("Popup positioned at center");
      return;
    }

    const { bottom, left } = rect;
    const { height, width } = popup.getBoundingClientRect();
    const top =
      bottom + height > window.innerHeight ? rect.top - height : bottom;
    const adjustedLeft =
      left + width > window.innerWidth ? window.innerWidth - width : left;

    Object.assign(popup.style, {
      top: `${top}px`,
      left: `${adjustedLeft}px`,
      transform: "none",
      position: "fixed",
      zIndex: "9999",
    });

    console.log(`Popup positioned at top: ${top}px, left: ${adjustedLeft}px`);
  },
};

// API interaction
const api = {
  fetchExplanation: async (apiKey, selectedText) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: `Explain this text concisely: "${selectedText}"`,
          },
        ],
      }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  explainText: async (selectedText) => {
    try {
      let apiKey = await apiKeyManager.get();
      if (!apiKey) apiKey = await apiKeyManager.prompt();
      if (!apiKey) throw new Error("No API key provided");
      const response = await api.fetchExplanation(apiKey, selectedText);
      return response.choices[0].message.content;
    } catch (error) {
      console.error("API request failed:", error);
      return "Error fetching explanation.";
    }
  },
};
// Event handlers
async function handleExplainClick() {
  console.log("Explain button clicked");
  const explainBtn = document.getElementById(EXPLAIN_BTN_ID);
  const explanationContent = document.getElementById(EXPLANATION_CONTENT_ID);
  explainBtn.disabled = true;
  explainBtn.textContent = "Loading...";
  try {
    const selectedText = await storage.get("selectedText");
    console.log("Selected text retrieved:", selectedText);
    const explanation = await api.explainText(selectedText);
    explanationContent.textContent = explanation;
    console.log("Explanation set in content");
  } catch (err) {
    console.error("Error in handleExplainClick:", err);
    explanationContent.textContent = "Failed to fetch explanation.";
  } finally {
    explainBtn.textContent = "Explain";
    explainBtn.disabled = false;
  }
}

// Main functionality
document.addEventListener("mouseup", async () => {
  console.log("Mouseup event detected");
  const selectedText = window.getSelection().toString().trim();
  if (!selectedText || selectedText === previousSelection) {
    console.log("No text selected, ignoring mouseup");
    return;
  }

  console.log("Text selected:", selectedText);
  await storage.set("selectedText", selectedText);

  previousSelection = selectedText;
  let popup = document.getElementById(POPUP_ID);
  if (!popup) {
    console.log("Popup doesn't exist, creating new one");
    popup = await ui.createPopup();
  } else {
    console.log("Popup already exists");
  }

  const selection = window.getSelection();
  const rect =
    selection.rangeCount > 0
      ? selection.getRangeAt(0).getBoundingClientRect()
      : null;
  ui.positionPopup(popup, rect);

  // Ensure the popup is visible
  popup.style.display = "block";
  console.log("Popup should now be visible");
});

// Debug logging
console.log("Smart Web Research Assistant content script loaded");
