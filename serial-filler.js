const serialFiller = {
  
  name: 'Serial Filler',

  supportedGenerators: [
    {
      id: 'pesels',
      title: 'PESEL'
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
      id: 'phones',
      title: 'Numer telefonu'
    },

        {
          parentId: 'phones',
          title: 'domowy jako 263 43 45',
          onclick: createRandomPatternInFormat.bind(null, 'ddd dd dd')
        },

        {
          parentId: 'phones',
          title: 'domowy jako 2634345',
          onclick: createRandomPatternInFormat.bind(null, '+ddddddd')
        },

        {
          parentId: 'phones',
          title: 'komórka jako 505 543 345',
          onclick: createRandomPatternInFormat.bind(null, 'ddd ddd ddd')
        },

        {
          parentId: 'phones',
          title: 'komórka jako 505543345',
          onclick: createRandomPatternInFormat.bind(null, 'ddddddddd')
        },

    {
      title: 'Email',
      onclick: generateRandomEmail
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
  },

  addOptionsToContextMenu() {
    this.supportedGenerators.forEach(this.createContextMenuOption, this);
  },

  createContextMenuOption(descriptor) {
    chrome.contextMenus.create(Object.assign({}, descriptor, {
        type: 'normal',
        contexts: ['editable'],
        onclick: (info, tab) => {
          chrome.tabs.sendMessage(tab.id, {
            value: descriptor.onclick()
          });
        }
      })
    );
  }
};


serialFiller.init();
