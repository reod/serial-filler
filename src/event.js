// generators are loaded from generators.js
// menu-bindings are loaded from menu-bindings.js

// set to true only for development
const debug = true;

// logger helper
function l() {
  if (debug) {
    console.info.call(console, 'debug:', ...arguments);
  }
};

// handler for empty function
function noop() {};

// handler for current suggestion because of no option
// in chrome API to determine state of menuItem after change
// (no ``)
let currentSuggestion = null;


// create menu
setTabsListener();
setMenuOnClickedListener();
setIconClickListener();
setOnContextMessageListener();
createContextMenu(menuBindings);

///////////////////////////////////////////////////////
// function definitions:

function setTabsListener() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
      updateBadge(0);
      return;
    }

    if (changeInfo.status === 'complete') {
      chrome.tabs.get(tabId, tab => {
        if (tab.url === 'chrome://newtab/') {
          updateBadge(0);
        } else {
          l('tab', tabId, 'updated; sending page report request');
          chrome.tabs.sendMessage(tabId, {
            action: 'GIVE_PAGE_REPORT',
          }, onPageReport);
        }
      });
    }
  });

  chrome.tabs.onActivated.addListener(activeInfo => {
    const { tabId } = activeInfo;

    l('tab', tabId, 'is active; sending page report request');
    chrome.tabs.sendMessage(tabId, {
      action: 'GIVE_PAGE_REPORT',
    }, onPageReport);
  });
};

function updateBadge(amount) {
  const badge = amount ? String(amount) : '';
  const title = badge ? `Autofill ${amount} fields.` : 'No fields to autofill.';
  chrome.browserAction.setBadgeText({ text: badge });
  chrome.browserAction.setTitle({ title });
};

function createContextMenu(descriptors = []) {
  descriptors.forEach(descriptor => {
    if (!descriptor.id) {
      throw new TypeError('No descriptor id.');
    }

    l('creating: ', descriptor.id);

    // translate custom to native
    const menuItem = customDescriptorToNative(descriptor);
    
    // create menu item
    chrome.contextMenus.create(menuItem);
  });
};

// form custom menuItemDescriptor, as in menuBindigs,
// create descriptor supported by chrome
function customDescriptorToNative(descriptor = {}) {
  // props allowed by documentation https://developer.chrome.com/extensions/contextMenus
  // all other are custom and throw exception when set
  const allowedProps = [
    'id', 'parentId', 'title', 'checked', 'contexts',
    'documentUrlPatterns', 'targetUrlPatterns', 'enabled'
  ];

  // defaults for all items
  const defaultDescriptorProps = {
    type: 'normal',
    contexts: ['editable']
  };

  let nativeDescriptor = Object.assign({}, defaultDescriptorProps, descriptor);
    
  // delete custom props
  Object.keys(nativeDescriptor).forEach(prop => {
    if (!allowedProps.includes(prop)) {
      delete nativeDescriptor[prop];
    }
  });

  return nativeDescriptor;
};

function setMenuOnClickedListener() {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    // We cannot determine action based on id because suggest option
    // implementation (suggest option always has `suggestion` id, but
    // can represent different user needs).
    // Instead we gona use `title` to determine the truth.
    const generator = getGeneratorFunction(info.menuItemId);
    const generatedValue = generator();

    l('clicked on', info.menuItemId);
    
    if (generatedValue) {
      l('sending', generatedValue, 'generated with', generator.name);

      chrome.tabs.sendMessage(tab.id, {
        action: 'SET_VALUE_FOR_CLICKED_ELEMENT',
        value: generatedValue
      });
    } else {
      l('no generator found');
    }
  });
};

function setIconClickListener() {
  chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.sendMessage(tab.id, {
      action: 'AUTOFILL',
    }, answerAutofillRequest);
  });
}

function getGeneratorFunction(id) {
  if (id === 'suggestion' && currentSuggestion) {
    return currentSuggestion.generator || noop;
  }

  const binding = menuBindings.find(item => item.id === id);
  if (binding) {
    return binding.generator || noop;
  }

  return noop;
};

function setOnContextMessageListener() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch(request.action) {
      case 'SET_SUGGESTION':
        setSuggestionByKeywords(request.keywords);
        break;
      default:
        l('unknown action', request.action);
        break;
    }
  });
};

function onPageReport(report) {
  l('page report:', report);

  // TODO: find out why and when is empty
  if (!report) {
    updateBadge(0);
    return;
  }

  const { fields: { length: amount } } = report;
  updateBadge(amount);
};

function setSuggestionByKeywords(keywords = []) {
  const suggestionByKeywords = findSuggestionByKeywords(keywords);
  let suggestion = {};

  if (!suggestionByKeywords) {
    l('no suggestion found based on keywords', keywords);
    suggestion = Object.assign(suggestion, getDefaultSuggestion());
  } else {
    l('found', suggestionByKeywords.id, 'based on keywords', keywords);
    suggestion = Object.assign(suggestion, suggestionByKeywords);
    suggestion.title = `sugestia: ${suggestion.title}`;

    // make sure it will be enabled because you don't know
    // if before suggestion was default, which is disabled
    suggestion.enabled = true;
  }

  // translate to native
  suggestion = customDescriptorToNative(suggestion);

  // set value for `currentSuggestion` handler before removing `id`
  setCurrentSuggestion(suggestion);
 
  // don't overwrite suggestion id or set parentId
  delete suggestion.id;
  delete suggestion.parentId;

  chrome.contextMenus.update('suggestion', suggestion);
};

function getDefaultSuggestion() {
  return menuBindings.find(item => item.id === 'suggestion');
};

// sets currentSuggestion handler to fresh and brand new binding 
function setCurrentSuggestion(suggestion) {
  currentSuggestion = Object.assign({}, menuBindings.find(binding => binding.id === suggestion.id));
};

function findSuggestionByKeywords(keywords) {
  const suggestion = menuBindings.find(binding => {
    if (!binding.keywords) {
      return false;
    }

    const match = binding.keywords.find(bindingKeyword => {
      return keywords.find(keyword => keyword.includes(bindingKeyword));
    });

    return match;
  });

  return suggestion;
};

function answerAutofillRequest(fields) {
  l('got autofill request', fields);

  const suggestions = fields
    .map(findSuggestionByKeywords)
    .map(binding => {
      let suggestion = {};

      if (!binding) {
        return suggestion;
      }

      if (!binding.generator) {
        return suggestion;
      }

      suggestion.generator = binding.generator.name;
      suggestion.value = binding.generator();

      return suggestion;
    });

  l('found suggestion', suggestions);

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const message = { action: 'SET_GENERATED_VALUES', suggestions };
    chrome.tabs.sendMessage(tabs[0].id, message, response => {
      l('response after set suggestions', response);
    });
  });
};
