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
    }
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


function generatePESEL(sex) {
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const date = getRandomDate();
  const fullYear = date.getFullYear();
  const y = fullYear % 100;
  let m = date.getMonth()+1;
  const d = date.getDate();
    
  if (fullYear >= 1800 && fullYear <= 1899) {
    m += 80;
  } else if (fullYear >= 2000 && fullYear <= 2099) {
    m += 20;
  } else if (fullYear >= 2100 && fullYear <= 2199) {
    m += 40;
  } else if (fullYear >= 2200 && fullYear <= 2299) {
    m += 60;
  }
    
  let numbers = [Math.floor(y/10), y%10, Math.floor(m/10), m%10, Math.floor(d/10), d%10];

  for (let i = numbers.length; i < weights.length - 1; i++) {
    numbers[i] = getRandomDigit();
  }

  if (sex === 'M') {
    numbers[weights.length - 1] = getRandomDigitFrom('13579');
  } else if (sex === 'F') {
    numbers[weights.length - 1] = getRandomDigitFrom('02468');
  } else {
    numbers[weights.length - 1] = getRandomDigit();
  }
      
  let controlNumber = 0;
  
  for (let i = 0; i < numbers.length; i++) {
    controlNumber += weights[i] * numbers[i];
  }
  
  controlNumber = (10 - (controlNumber % 10)) % 10;
              
  let pesel = '';
  for (let i = 0; i < numbers.length; i++) {
    pesel += numbers[i];
  }

  pesel += controlNumber;  
  
  return pesel; 
};

function getRandomDate() {
  const from = new Date(1800, 0, 1).getTime();
  const to = new Date(2299, 0, 1).getTime();

  return new Date(from + Math.random() * (to - from));
};

function getRandomDigit() {
  return Math.floor(Math.random() * 10);
};
  
function getRandomDigitFrom(digits = '0123456789') {
  const i = Math.floor(Math.random() * digits.length);
  return digits[i];
};
