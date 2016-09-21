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

// menu options binded to generators
const menuBindings = [

  // handler for suggestion
  {
    id: 'suggestion', 
    title: 'brak sugestii, wybierz z listy:',
    enabled: false,
  },

  // other options
  {
    id: 'pesels',
    title: 'PESEL',
    generator: generatePESEL,
    keywords: ['pesel'],
  },

  {
    id: 'pesel_male',
    parentId: 'pesels',
    title: 'PESEL mężczyzny',
    generator: generatePESEL.bind(null, 'M'),
  },

  {
    id: 'pesel_female',
    parentId: 'pesels',
    title: 'PESEL kobiety',
    generator: generatePESEL.bind(null, 'F'),
  },

  {
    id: 'nip',
    title: 'NIP',
    generator: generateNIP,
    keywords: ['nip'],
  },

  {
    id: 'regons',
    title: 'REGON',
    generator: generateREGON.bind(null, 9),
    keywords: ['regon'],
  },

  {
    id: 'regon_9',
    parentId: 'regons',
    title: 'REGON 9  znaków',
    generator: generateREGON.bind(null, 9),
    keywords: ['regon-9'],
  },

  {
    id: 'regon_14',
    parentId: 'regons',
    title: 'REGON 14 znaków',
    generator: generateREGON.bind(null, 14),
    keywords: ['regon-14'],
  },

  {
    id: 'krs',
    title: 'KRS',
    generator: generateKRS,
    keywords: ['krs'],
  },

  {
    id: 'phones',
    title: 'Numer telefonu',
  },

  {
    id: 'phone_a',
    parentId: 'phones',
    title: 'Numer telefonu 504234213',
    generator: createRandomPatternInFormat.bind(null, 'ddddddddd'),
    keywords: ['phone', 'mobile-phone'],
  },

  {
    id: 'phone_b',
    parentId: 'phones',
    title: 'Numer telefonu jako 2549923',
    generator: createRandomPatternInFormat.bind(null, 'ddddddd'),
    keywords: ['landline-phone'],
  },

  {
    id: 'email',
    title: 'Email',
    generator: generateRandomEmail,
    keywords: ['email'],
  },

  {
    id: 'sentence',
    title: 'Jedno zdanie',
    generator: generateLoremIpsumSentence,
    keywords: ['sentence'],
  },

  {
    id: 'paragraph',
    title: 'Cały akapit',
    generator: generateLoremIpsumParagraph,
    keywords: ['paragraph'],
  },
  {
    id: 'many_paragraphs',
    title: 'Kilka akapitów',
    generator: generateLoremIpsum,
    keywords: ['email'],
  },

];

// handler for current suggestion because of no option
// in chrome API to determine state of menuItem after change
// (no ``)
let currentSuggestion = null;



// create menu
createContextMenu(menuBindings);
setMenuOnClickedListener();
setOnContextMessageListener();

///////////////////////////////////////////////////////
// function definitions:

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
  chrome.runtime.onMessage.addListener(request => {
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

    const match = keywords.find(keyword => {
      return binding.keywords.includes(keyword);
    });

    return match;
  });

  return suggestion;
};