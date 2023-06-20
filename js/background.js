chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "generateLinks") {
    chrome.management.getAll(function(extensions) {
      extensions.sort(function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      var htmlContent = '<!DOCTYPE html><html><head><title>Extension Links</title>';
      htmlContent += '<style>';
      htmlContent += 'body { font-family: Arial, sans-serif; background-color: #0B0B09; color: #F8F8F8; padding: 20px; margin-right: 10px; }';
      htmlContent += 'h1 { text-align: center; }';
      htmlContent += '.extension-list { display: flex; flex-wrap: wrap; justify-content: center; gap: 25px; margin-bottom: 20px; }';
      htmlContent += '.extension-item { width: calc(20% - 50px); padding: 20px; background-color: #003052; border-radius: 10px; border: 1px solid #0052cc; min-height: 120px; }';
      htmlContent += '.extension-title { color: #F8F8F8; text-align: center; }';
      htmlContent += '.extension-number { display: inline-block; width: 24px; height: 24px; background-color: #0052cc; color: #F8F8F8; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 10px; }';
      htmlContent += '.extension-details { display: flex; flex-direction: column; align-items: center; text-align: center; }';
      htmlContent += '.extension-button { margin-top: 10px; padding: 10px 20px; font-size: 14px; background-color: #0052cc; color: #F8F8F8; border: none; border-radius: 4px; cursor: pointer; }';
      htmlContent += '.extension-button:hover { background-color: #7692FF; }';
      htmlContent += '.ghost-cell { width: calc(20% - 50px); visibility: hidden; }';
      htmlContent += '.open-all-bar { width: 100%; display: flex; justify-content: center; margin-bottom: 20px; }';
      htmlContent += '.open-all-button { padding: 10px 20px; font-size: 14px; background-color: #0052cc; color: #F8F8F8; border: none; border-radius: 4px; cursor: pointer; width: calc(90% - 60px); }';
      htmlContent += '</style>';
      htmlContent += '</head><body>';
      htmlContent += '<h1>Extension Links</h1>';
      htmlContent += '<div class="open-all-bar">';
      htmlContent += '<button class="open-all-button" onclick="openAllExtensions()">Open All</button>';
      htmlContent += '</div>';
      htmlContent += '<div class="extension-list">';

      var totalExtensions = extensions.length;
      var numColumns = 4;
      var numRows = Math.ceil(totalExtensions / numColumns);
      var numEmptyCells = numColumns - (totalExtensions % numColumns);

      chrome.storage.sync.get(null, function(items) {
        // Filter extensions based on enabled state
        var enabledExtensions = extensions.filter(function(extension) {
          return items[extension.id];
        });

        enabledExtensions.sort(function(a, b) {
          return a.name.localeCompare(b.name);
        });

        // Generate HTML links for enabled extensions
        for (var i = 0; i < enabledExtensions.length; i++) {
          var extension = enabledExtensions[i];
          var storeUrl = 'https://chrome.google.com/webstore/detail/' + extension.id;
          var extensionNumber = i + 1;
          htmlContent += '<div class="extension-item">';
          htmlContent += '<span class="extension-number">' + extensionNumber + '</span>';
          htmlContent += '<div class="extension-details">';
          htmlContent += '<p><span class="extension-title">' + extension.name + '</span></p>';
          htmlContent += '<button class="extension-button" onclick="window.open(\'' + storeUrl + '\')">Open</button>';
          htmlContent += '</div>';
          htmlContent += '</div>';
        }

        if (numEmptyCells > 0 && numEmptyCells < numColumns) {
          for (var j = 0; j < numEmptyCells; j++) {
            htmlContent += '<div class="extension-item ghost-cell"></div>';
          }
        }

        htmlContent += '</div>';
        htmlContent += '</body>';
        htmlContent += '<script>';
        htmlContent += 'function openAllExtensions() {';
        htmlContent += '  var extensionButtons = document.getElementsByClassName("extension-button");';
        htmlContent += '  for (var k = 0; k < extensionButtons.length; k++) {';
        htmlContent += '    window.open(extensionButtons[k].getAttribute("onclick").match(/\'([^\']+)\'/)[1]);';
        htmlContent += '  }';
        htmlContent += '}';
        htmlContent += '</script>';
        htmlContent += '</html>';

        chrome.downloads.download({
          url: 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent),
          filename: 'Extensions.html',
          saveAs: true
        }, function() {
          sendResponse({});
        });
      });

    });

    return true;
  }
});
