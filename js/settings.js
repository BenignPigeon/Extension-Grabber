//generates the check boxes with the extensions.
document.addEventListener('DOMContentLoaded', function() {
    var selectAllButton = document.getElementById('selectAllButton');
    var deselectAllButton = document.getElementById('deselectAllButton');
    var extensionList = document.getElementById('extensionList');
  
    selectAllButton.addEventListener('click', function() {
      toggleCheckboxes(true);
      updateButtons();
      saveExtensionStates();
    });
  
    deselectAllButton.addEventListener('click', function() {
      toggleCheckboxes(false);
      updateButtons();
      saveExtensionStates();
    });
  
    chrome.management.getAll(function(extensions) {
      extensions.sort(function(a, b) {
        return a.name.localeCompare(b.name);
      });
  
      extensions.forEach(function(extension) {
        var listItem = document.createElement('li');
        listItem.classList.add('extension-item');
  
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = extension.id;
        checkbox.checked = extension.enabled;
        listItem.appendChild(checkbox);
  
        var label = document.createElement('label');
        label.setAttribute('for', extension.id);
        label.innerText = extension.name;
        listItem.appendChild(label);
  
        extensionList.appendChild(listItem);
      });
  
      var checkboxes = extensionList.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
          updateButtons();
          saveExtensionStates();
        });
      });
  
      updateButtons();
    });
  
    function toggleCheckboxes(checked) {
      var checkboxes = extensionList.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(function(checkbox) {
        checkbox.checked = checked;
      });
    }
  
    function updateButtons() {
      var checkboxes = extensionList.querySelectorAll('input[type="checkbox"]');
      var allChecked = Array.from(checkboxes).every(function(checkbox) {
        return checkbox.checked;
      });
      var allUnchecked = Array.from(checkboxes).every(function(checkbox) {
        return !checkbox.checked;
      });
  
      selectAllButton.disabled = allChecked;
      deselectAllButton.disabled = allUnchecked;
    }
  
    function saveExtensionStates() {
      var extensionStates = {};
      var checkboxes = extensionList.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(function(checkbox) {
        extensionStates[checkbox.id] = checkbox.checked;
      });
  
      // Save extension states using chrome.storage or perform any necessary actions
      chrome.storage.sync.set(extensionStates, function() {
        console.log('Extension states saved');
      });
    }
  
    // Load extension states on page load
    chrome.storage.sync.get(null, function(items) {
      Object.keys(items).forEach(function(key) {
        var checkbox = extensionList.querySelector('#' + key);
        if (checkbox) {
          checkbox.checked = items[key];
        }
      });
      updateButtons();
    });

//Dark-mode code

const toggleSwitch = document.getElementById('dark-mode-toggle');
const darkMode = localStorage.getItem('darkMode');

// Check if dark mode is enabled in localStorage
if (darkMode === 'enabled') {
  document.documentElement.classList.add('dark-mode');
  toggleSwitch.checked = true;
}

  });

    

