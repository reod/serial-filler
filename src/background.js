// placeholder for clicket element
let clickedEl = null;

document.addEventListener('mousedown', setClickedElement);
// don't know why, but when this is added, suggestion just work
// without second listener suggestion title is rendered as previous one 
document.addEventListener('contextmenu', someDelay);
chrome.runtime.onMessage.addListener(setClickedElementValue);


function someDelay(e) {
  for (let i = 0; i < 10; i++) {
    console.info('SerialFiller says hello.');
  }
};

function setClickedElement(e) {
  clickedEl = null;

  // test only right click
  if (e.button !== 2) {
    return;
  }

  let tagName = e.target.tagName.toLowerCase();

  if (tagName === 'textarea' || tagName === 'input') {
    clickedEl = e.target;
    const suggestionKeywords = getSuggestionKeywords(clickedEl);
    chrome.runtime.sendMessage({ suggestionKeywords });
  }
};

function getSuggestionKeywords(el) {
  let keywords = [];

  // add class names
  keywords.push(...el.classList);
  
  // add id
  if (el.id) {
    keywords.push(el.id);  
  }
  
  // add data attributes names
  const attrsNames = Object.keys(el.dataset);
  keywords.push(...attrsNames);

  // normalize
  keywords = keywords.map(k => String.prototype.toLowerCase.call(k));

  // only unique
  keywords = [...new Set(keywords)];

  return keywords;
};

function setClickedElementValue(request) {
  if (!clickedEl || !request || !request.value) {
    return;
  }

  clickedEl.value = request.value;
};