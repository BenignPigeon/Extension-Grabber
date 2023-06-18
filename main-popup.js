document.getElementById('generateButton').addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: "generateLinks" }, function(response) {
    chrome.action.setBadgeText({ text: "" });
  });
});
