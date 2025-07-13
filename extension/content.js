
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    // A simple heuristic to extract main content. 
    // It prioritizes <article>, then <main>, then falls back to the whole body.
    let mainContent = '';
    const articleElement = document.querySelector('article');
    const mainElement = document.querySelector('main');

    if (articleElement) {
        mainContent = articleElement.innerText;
    } else if (mainElement) {
        mainContent = mainElement.innerText;
    } else {
        mainContent = document.body.innerText;
    }
    
    sendResponse({ content: mainContent });
    return true; // Keep the message channel open for the asynchronous response.
  }
});


window.addEventListener("message", (event) => {
    // We only accept messages from ourselves (the window)
    if (event.source !== window) {
        return;
    }

    if (event.data.type && (event.data.type === "BIASBUSTER_API_KEY")) {
        console.log("Biasbuster: API Key received from web page.");
        chrome.storage.local.set({ apiKey: event.data.apiKey }, () => {
            console.log("Biasbuster: API Key saved to extension storage.");
        });
    }
}, false);
