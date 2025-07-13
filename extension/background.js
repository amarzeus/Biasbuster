
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "biasbuster-selection",
    title: "Analyze selected text with Biasbuster",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "biasbuster-selection" && info.selectionText) {
    // Save the selected text to local storage for the popup to retrieve.
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      // Notify the user that the text is ready for analysis in the popup.
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'extension/icons/icon48.png',
        title: 'Biasbuster',
        message: 'Text captured! Click the Biasbuster icon in your toolbar to see the analysis.',
      });
    });
  }
});
