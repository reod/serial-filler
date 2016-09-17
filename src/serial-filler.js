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
      _custom: { keywords: ['pesel'] }
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
      _custom: { keywords: ['regon'] }
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
      _custom: { keywords: ['nip'] }
    },

    {
      title: 'Nr dowodu osobistego',
      onclick: generatePLIDNumber.bind(null),
      _custom: { keywords: ['nr-dowodu'] }
    },

    {
      title: 'KRS',
      onclick: generateKRS.bind(null),
      _custom: { keywords: ['krs'] }
    },

    {
      id: 'phones',
      title: 'Numer telefonu'
    },

        {
          parentId: 'phones',
          title: 'domowy jako 263 43 45',
          onclick: createRandomPatternInFormat.bind(null, 'ddd dd dd'),
          _custom: { keywords: ['landline-phone'] }
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
          _custom: { keywords: ['mobile-phone'] }
        },

        {
          parentId: 'phones',
          title: 'komórka jako 505543345',
          onclick: createRandomPatternInFormat.bind(null, 'ddddddddd')
        },

    {
      title: 'Email',
      onclick: generateRandomEmail,
      _custom: { keywords: ['email'] }
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
      if (!request || !request.suggestionKeywords) {
        return;
      }

      // FIXME: update is noticeable after second menu opening
      const suggestionDescriptor = this.getSugestionDescriptor(request.suggestionKeywords);
      chrome.contextMenus.update('suggestion', suggestionDescriptor, onUpdated);  
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

  getSugestionDescriptor(suggestionKeywords) {
    let suggestionDescriptor;

    const suggestion = this.supportedGenerators.find(descriptor => {
      if (!descriptor._custom) {
        return false;
      }
    
      if (!descriptor._custom.keywords) {
        return false;
      }

      const keywords = descriptor._custom.keywords;
      const match = suggestionKeywords.find(
        suggestion => keywords.find(
          keyword => suggestion.includes(keyword)
        )
      );

      return match;
    });

    if (suggestion) {
      suggestionDescriptor = Object.assign({}, suggestion);
      suggestionDescriptor.title = `sugestia: ${suggestionDescriptor.title}`;
      suggestionDescriptor.enabled = true;
    } else {
      suggestionDescriptor = this.supportedGenerators.find(
        generator => generator.id === 'suggestion'
      );
      suggestionDescriptor.enabled = false;
    }

    suggestionDescriptor = this.customDescriptorToNative(suggestionDescriptor);
    // don't update id or set parentId
    delete suggestionDescriptor.id;
    delete suggestionDescriptor.parentId;

    return suggestionDescriptor;
  }
};

serialFiller.init();
