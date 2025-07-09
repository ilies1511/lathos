chrome.runtime.onInstalled.addListener(() => {
  // For testing: set your API key here
  chrome.storage.local.set({ openaiApiKey: "" });
});

