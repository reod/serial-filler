// set to true only for development
const debug = false;

// for pages with example
const sfDOMId = document.createElement('div');
sfDOMId.id = '__SERIAL__FILLER__INSTALLED';
document.body.appendChild(sfDOMId);

// logger helper
function l() {
  if (debug) {
    console.info.call(console, 'debug:', ...arguments);
  }
};

// HTML elements that can be autofill
const EDITABLE_TAGS = ['input', 'textarea'];

// placeholder for clicket element
let clickedEl = null;

// placeholder for fields that can be autofilles
let fieldsToAutofill = [];

// placeholder for suggestions related with filds (order matters!!!)
let suggestionsForAutofill = [];

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

function onContextMessage(request, sender, sendResponse) {
  switch(request.action) {
    case 'CREATE_PAGE_REPORT':
      createPageReport(...arguments);
      break;
    case 'SET_SUGGESTIONS':
      setSuggestions(...arguments);
      break;
    case 'AUTOFILL':
      autofill(...arguments);
      break;
    case 'SET_VALUE_FOR_CLICKED_ELEMENT': 
      setClickedElementValue(request.value); 
      break;
    default: 
      l('unknown action', request.action);
      break;
  }
};

function setClickedElement(e) {
  clickedEl = null;

  // test only right click
  if (e.button !== 2) {
    return;
  }

  let tagName = e.target.tagName.toLowerCase();

  if (EDITABLE_TAGS.includes(tagName)) {
    clickedEl = e.target;
    chrome.runtime.sendMessage({
      action: 'SET_SUGGESTION',
      keywords: getSuggestionKeywords(clickedEl)
    });
  }
};

function getSuggestionKeywords(el) {
  let keywords = [];

  // collect attributes values
  const attributes = [
    'id', 'type', 'role', 'alt', 'name',
    'aria-labelledby', 'title', 'type',
    'placeholder', 'label'
  ];

  attributes.forEach(attribute => {
    keywords.push(el.getAttribute(attribute));
  });

  // add class names
  keywords.push(...el.classList);
  
  // add data attributes names
  const attrsNames = Object.keys(el.dataset);
  keywords.push(...attrsNames);

  // add value of label
  keywords.push(...getKeywordsFromLabels(el.labels || []));

  // collect keywords from parent only when el is editable
  const elTag = el.nodeName.toLowerCase();

  if (EDITABLE_TAGS.includes(elTag)) {
    keywords.push(...getSuggestionKeywords(el.parentNode));
  } 

  // normalize
  keywords = keywords
    .filter(Boolean)
    .map(keyword => {
      keyword = String(keyword);
      return keyword.toLowerCase(keyword);
    });

  // only unique
  keywords = [...new Set(keywords)];

  l('keywords', keywords);

  return keywords;
};

function getKeywordsFromLabels(labels = []) {
  return Array.from(labels)
    .map(label => label.innerText.trim())
    .filter(Boolean);  
};

function setClickedElementValue(value) {
  l('setting', value);
  clickedEl.value = value;
};

function createPageReport(request, sender, sendResponse) {
  const selector = EDITABLE_TAGS.join(', ');
  fieldsToAutofill = Array.from(document.querySelectorAll(selector));
  const keywordsForFields = fieldsToAutofill.map(getSuggestionKeywords);
  l('sending report to', sender);
  sendResponse({ fields: keywordsForFields });
};

function setSuggestions(request, sender, sendResponse) {
  const { suggestions } = request;
  suggestionsForAutofill = suggestions;
  sendResponse({ status: 'done' });
};

function autofill(request, sender, sendResponse) {
  l('got fill request', request);

  let filed = 0;

  fieldsToAutofill.forEach((field, index) => {
    if (suggestionsForAutofill[index].value) {
      field.value = suggestionsForAutofill[index].value;
      filed++;
    }
  });

  const status = `filed: ${filed}, not: ${suggestionsForAutofill.length - filed}`;

  sendResponse({ status });
};
