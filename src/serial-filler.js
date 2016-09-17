const serialFiller = {
  
  name: 'Serial Filler',

  supportedGenerators: [
    
    {
      id: 'suggestion',
      title: 'brak sugestii, wybierz z listy:',
      enabled: false,
      onclick: () => false
    },

    {
      id: 'pesels',
      title: 'PESEL',
      onclick: generatePESEL,
      _custom: { forClass: 'pesel' }
    },

        {
          parentId: 'pesels',
          title: 'PESEL mężczyzny',
          onclick: generatePESEL.bind(null, 'M')
        },

        {
          parentId: 'pesels',
          title: 'PESEL kobiety',
          onclick: generatePESEL.bind(null, 'F')
        },

    {
      id: 'regons',
      title: 'REGON',
      onclick: generateREGON.bind(null, 9),
      _custom: { forClass: 'regon' }
    },

        {
          parentId: 'regons',
          title: 'REGON 9 znakwów',
          onclick: generateREGON.bind(null, 9)
        },

        {
          parentId: 'regons',
          title: 'REGON 14 znakwów',
          onclick: generateREGON.bind(null, 14)
        },

    {
      title: 'NIP',
      onclick: generateNIP.bind(null),
      _custom: { forClass: 'nip' }
    },

    {
      title: 'Nr dowodu osobistego',
      onclick: generatePLIDNumber.bind(null),
      _custom: { forClass: 'nr-dowodu' }
    },

    {
      title: 'KRS',
      onclick: generateKRS.bind(null),
      _custom: { forClass: 'krs' }
    },

    {
      id: 'phones',
      title: 'Numer telefonu'
    },

        {
          parentId: 'phones',
          title: 'domowy jako 263 43 45',
          onclick: createRandomPatternInFormat.bind(null, 'ddd dd dd'),
          _custom: { forClass: 'landline-phone' }
        },

        {
          parentId: 'phones',
          title: 'domowy jako 2634345',
          onclick: createRandomPatternInFormat.bind(null, 'ddddddd')
        },

        {
          parentId: 'phones',
          title: 'komórka jako 505 543 345',
          onclick: createRandomPatternInFormat.bind(null, 'ddd ddd ddd'),
          _custom: { forClass: 'mobile-phone' }
        },

        {
          parentId: 'phones',
          title: 'komórka jako 505543345',
          onclick: createRandomPatternInFormat.bind(null, 'ddddddddd')
        },

    {
      title: 'Email',
      onclick: generateRandomEmail,
      _custom: { forClass: 'email' }
    },

    {
      title: 'Jedno zdanie',
      onclick: generateLoremIpsum
    },

    {
      title: 'Cały akapit',
      onclick: generateLoremIpsumParagraph
    },

    {
      title: 'Kilka akapitów',
      onclick: generateLoremIpsum
    },
  ],
  
  init() {
    this.addOptionsToContextMenu();
    this.initSuggestionMechanism();
  },

  addOptionsToContextMenu() {
    this.supportedGenerators.forEach(this.createContextMenuOption, this);
  },

  initSuggestionMechanism() {
    chrome.runtime.onMessage.addListener(request => {
      if (!request || !request.clickedElInfo) {
        return;
      }

      const suggestionDescriptor = this.getSugestionDescriptor(request.clickedElInfo);
      chrome.contextMenus.update('suggestion', suggestionDescriptor);
    });
  },

  createContextMenuOption(customDescriptor) {
    const descriptor = this.customDescriptorToNative(customDescriptor);
    chrome.contextMenus.create(descriptor);
  },

  customDescriptorToNative(descriptor) {
    const itemDescriptor = Object.assign({}, descriptor, {
      type: 'normal',
      contexts: ['editable'],
      onclick: (info, tab) => {
        chrome.tabs.sendMessage(tab.id, {
          value: descriptor.onclick()
        });
      }
    });

    delete itemDescriptor._custom;

    return itemDescriptor;
  },

  getSugestionDescriptor(elementInfo) {
    let suggestionDescriptor;

    const descriptorByClassName = this.supportedGenerators.find(menuItem => {
      const bindings = menuItem._custom;
        if (!bindings || !bindings.forClass) {
          return false;
        }

        return elementInfo.classList.find(className => {
          return className.includes(bindings.forClass);
        });
    });

    if (descriptorByClassName) {
      suggestionDescriptor = Object.assign({}, descriptorByClassName);
      suggestionDescriptor.title = `sugestia: ${suggestionDescriptor.title}`;
      suggestionDescriptor.enabled = true;
    } else {
      suggestionDescriptor = this.supportedGenerators.find(g => g.id === 'suggestion');
      suggestionDescriptor.enabled = false;
    }

    suggestionDescriptor = this.customDescriptorToNative(suggestionDescriptor);
    // don't update id or set parentId
    delete suggestionDescriptor.id;
    delete suggestionDescriptor.parentId;

    return suggestionDescriptor;
  }
};

//https://jsfiddle.net/todv47yz/

serialFiller.init();
