// background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "generateLinks") {
    chrome.management.getAll(function(extensions) {
      var htmlContent = '<!DOCTYPE html><html><head><title>Extension Links</title></head><body>';
      for (var i = 0; i < extensions.length; i++) {
        var extension = extensions[i];
        var storeUrl = 'https://chrome.google.com/webstore/detail/' + extension.id;
        htmlContent += '<a href="' + storeUrl + '">' + extension.name + '</a><br>';
      }
      htmlContent += '<button id="openAllButton">Open All</button>';
      htmlContent += '</body><script>document.getElementById("openAllButton").addEventListener("click", function() {';
      htmlContent += 'var links = document.getElementsByTagName("a");';
      htmlContent += 'for (var i = 0; i < links.length; i++) {';
      htmlContent += 'window.open(links[i].href);';
      htmlContent += '} });</script></html>';

      chrome.downloads.download({
        url: 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent),
        filename: 'extension_links.html',
        saveAs: true
      });
    });
    sendResponse({});
  }
});
