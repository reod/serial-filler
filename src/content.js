// set to true only for development
const debug = true;

// logger helper
function l() {
  if (debug) {
    console.info.call(console, 'debug:', ...arguments);
  }
};

// placeholder for clicket element
let clickedEl = null;

document.addEventListener('mousedown', setClickedElement);
// don't know why, but when this is added, suggestion just work
// without second listener suggestion title is rendered as previous one 
document.addEventListener('contextmenu', someDelay);
chrome.runtime.onMessage.addListener(onContextMessage);


function someDelay(e) {
  for (let i = 0; i < 20; i++) {
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
    chrome.runtime.sendMessage({
      action: 'SET_SUGGESTION',
      keywords: getSuggestionKeywords(clickedEl)
    });
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

function onContextMessage(request) {
  l('message', request.action);

  switch(request.action) {
    case 'SET_VALUE_FOR_CLICKED_ELEMENT': 
      setClickedElementValue(request.value); 
      break;
    default: 
      l('unknown action', request.action);
      break;
  }
};

function setClickedElementValue(value) {
  l('setting', value)
  clickedEl.value = value;
};