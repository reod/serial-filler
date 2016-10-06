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

// placeholder for fields that can be autofilles
let fieldsToAutofill = null;

document.addEventListener('mousedown', setClickedElement);
// don't know why, but when this is added, suggestion just work
// without second listener suggestion title is rendered as previous one 
document.addEventListener('contextmenu', someDelay);
chrome.runtime.onMessage.addListener(onContextMessage);
suggestAutoFilling();


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
  keywords.push(...getKeywordsFromLabels(el.labels));

  // collect keywords from parent only when el is editable
  const elTag = el.nodeName.toLowerCase();
  const editableTags = ['input', 'textarea'];

  if (editableTags.includes(elTag)) {
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

  l('keywords', keywords)

  return keywords;
};

function getKeywordsFromLabels(labels = []) {
  return Array.from(labels)
    .map(label => label.innerText.trim())
    .filter(Boolean);  
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

function suggestAutoFilling() {
  fieldsToAutofill = Array.from(document.querySelectorAll('input, textarea'));

  if (!fieldsToAutofill.length) {
    return;
  }

  const keywordsForFields = fieldsToAutofill.map(getSuggestionKeywords);

  const question = document.createElement('div');
  question.classList.add('serial_filler_question_wrapper');
  question.addEventListener('click', () => { sendAutofillRequest(keywordsForFields); });

  const itemsAmount = document.createElement('span');
  itemsAmount.classList.add('serial_filler_question_label');
  itemsAmount.textContent = `Psst..., uzupełnić ci ${fieldsToAutofill.length} pól? SF`;

  question.appendChild(itemsAmount);
  document.body.appendChild(question);

  setTimeout(() => {
    question.classList.add('opened');
  }, 1000);

  setTimeout(() => {
    question.classList.remove('opened');
  }, 6000);
};

function sendAutofillRequest(fields) {
  const message = { action: 'AUTOFILL', fields };
  chrome.runtime.sendMessage(message, onAutofillResponse);
};

function onAutofillResponse(response) {
  l('got suggestion response', response);

  const suggestions = response.suggestions;
  fieldsToAutofill.forEach((field, index) => {
    if (suggestions[index].value) {
      field.value = suggestions[index].value;
    }
  });
};
