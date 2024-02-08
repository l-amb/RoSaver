// popup.js

document.addEventListener('DOMContentLoaded', function () {
  const priceCheckbox = document.getElementById('priceCheckbox');

  // Load the saved checkbox state
  chrome.storage.sync.get(['enablePriceDisplay'], function (result) {
    priceCheckbox.checked = result.enablePriceDisplay || false;
  });

  // Handle checkbox state change
  priceCheckbox.addEventListener('change', function () {
    chrome.storage.sync.set({ enablePriceDisplay: priceCheckbox.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { enablePriceDisplay: priceCheckbox.checked });
    });
  });
});
