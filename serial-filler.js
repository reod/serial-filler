const serialFiller = {
  
  name: 'Serial Filler',

  supportedGenerators: [
    {
      menuText: 'PESEL mężczyzny',
      generatorFn: generatePESEL.bind('M')
    },

    {
      menuText: 'PESEL kobiety',
      generatorFn: generatePESEL.bind('F')
    },

    {
      menuText: 'Jedno zdanie',
      generatorFn: generateLoremIpsum
    },

    {
      menuText: 'Cały akapit',
      generatorFn: generateLoremIpsumParagraph
    },

    {
      menuText: 'Kilka akapitów',
      generatorFn: generateLoremIpsum
    },
  ],
  
  init() {
    this.addOptionsToContextMenu();
  },

  addOptionsToContextMenu() {
    this.supportedGenerators.forEach(this.createContextMenuOption, this);
  },

  createContextMenuOption(generator) {
    const { menuText, generatorFn } = generator;
    const menuOptionDescriptor = {
      title: menuText,
      type : 'normal',
      contexts : ['editable'],
      onclick: (info, tab) => {
        chrome.tabs.sendMessage(tab.id, { value: generatorFn() });
      }
    };

    chrome.contextMenus.create(menuOptionDescriptor);   
  }
};


serialFiller.init();
