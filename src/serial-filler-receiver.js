// placeholder for clicket element
let clickedEl = null;

document.addEventListener('mousedown', setClickedElAndInfo);
chrome.runtime.onMessage.addListener(setClickedElValue);


function setClickedElAndInfo(e) {
  clickedEl = null;

  // test only right click
  if (e.button !== 2) {
    return;
  }

  let tagName = e.target.tagName.toLowerCase();
  if (tagName === 'textarea' || tagName === 'input') {
    clickedEl = e.target;
    const clickedElInfo = {
      classList: [].slice.call(clickedEl.classList)
    };

    chrome.runtime.sendMessage({ clickedElInfo });
  }
};

function setClickedElValue(request) {
  if (!clickedEl || !request || !request.value) {
    return;
  }

  clickedEl.value = request.value;
};