let clickedEl = null;


document.addEventListener('mousedown', e => {
  clickedEl = null;

  // test only right click
  if (e.button !== 2) {
    return;
  }

  let tagName = e.target.tagName.toLowerCase();
  if (tagName === 'textarea' || tagName === 'input') {
    clickedEl = e.target;
  }
});

chrome.runtime.onMessage.addListener(request => {
  if (!clickedEl || !request || !request.value) {
    return;
  }

  clickedEl.value = request.value;
});
