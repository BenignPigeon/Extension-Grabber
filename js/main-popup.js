document.getElementById('generateHTMLButton').addEventListener('click', function() {
  chrome.runtime.sendMessage({ action: "generateLinks" }, function(response) {
    chrome.action.setBadgeText({ text: "" });
  });
});

//Dark-mode code

const toggleSwitch = document.getElementById('dark-mode-toggle');
const darkMode = localStorage.getItem('darkMode');

// Check if dark mode is enabled in localStorage
if (darkMode === 'enabled') {
  document.documentElement.classList.add('dark-mode');
  toggleSwitch.checked = true;
}

toggleSwitch.addEventListener('change', function() {
  if (this.checked) {
    enableDarkMode();
    localStorage.setItem('darkMode', 'enabled');
  } else {
    disableDarkMode();
    localStorage.setItem('darkMode', 'disabled');
  }
});

function enableDarkMode() {
  document.documentElement.classList.add('dark-mode');
  toggleSwitch.parentNode.classList.add('animated');
  console.log('Switch is on');
}

function disableDarkMode() {
  document.documentElement.classList.remove('dark-mode');
  console.log('Switch is off');
}



