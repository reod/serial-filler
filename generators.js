function generatePESEL(sex) {
  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const date = generateRandomDate();
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
    numbers[i] = generateRandomDigit();
  }

  if (sex === 'M') {
    numbers[weights.length - 1] = generateRandomCharFrom('13579');
  } else if (sex === 'F') {
    numbers[weights.length - 1] = generateRandomCharFrom('02468');
  } else {
    numbers[weights.length - 1] = generateRandomDigit();
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

function generateRandomDate() {
  const from = new Date(1800, 0, 1).getTime();
  const to = new Date(2299, 0, 1).getTime();

  return new Date(from + Math.random() * (to - from));
};

function generateRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function generateRandomCharFrom(chars = '') {
  const i = Math.floor(Math.random() * chars.length);
  return chars[i];
};

function generateRandomDigit(notZero = false) {
  const digits = notZero? '123456789' : '0123456789';
  return generateRandomCharFrom(digits);
};

function generateRandomLetter() {
  // TODO: check if it's whole alphabeth
  const alphabeth = 'abcdefghijklmnoprstuwxyz';
  return generateRandomCharFrom(alphabeth);
};

function createRandomPatternInFormat(format = '') {
  const replacer = c => {
    switch(c) {
      case 'd': return generateRandomDigit();
      case 's': return generateRandomLetter();
      default: return c;
    }
  };

  return format
    .split('')
    .map(replacer)
    .join('');
};

function generateLoremIpsum() {
  return (
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eleifend, leo eu eleifend ullamcorper, elit arcu mattis lectus, ut bibendum nunc turpis sit amet ante. Aenean et purus et enim ultricies tincidunt sit amet et urna. Maecenas vestibulum at urna a porttitor. Duis commodo diam feugiat nunc pulvinar, sed efficitur leo blandit. Etiam dignissim elementum lectus vitae elementum. Nam lacinia varius elementum. Quisque consectetur quam eget molestie ornare. Proin vestibulum, orci eget iaculis consectetur, risus eros dictum nunc, et sodales tellus quam vel nibh. Proin luctus rutrum consectetur. Etiam et justo sit amet nisi eleifend fermentum. Vivamus nibh quam, pharetra non purus id, consequat rhoncus urna. Nulla facilisi. Vivamus tincidunt condimentum sapien, at aliquam mauris rhoncus eget. Quisque pretium bibendum rhoncus.
    Aenean molestie fringilla sapien, sit amet feugiat ligula elementum ultricies. Phasellus eget odio eget elit lacinia pulvinar fermentum eu libero. Donec luctus mauris sed tortor suscipit, in bibendum metus bibendum. In quis nibh nec mi sagittis lobortis. Praesent id rutrum ante. Nunc bibendum ipsum eu dui placerat, id vestibulum felis elementum. Mauris ac ultrices leo, quis aliquam elit. In in tellus non enim pretium mollis. Phasellus faucibus tempus mollis. Nunc in augue id neque malesuada hendrerit at et urna. Sed ac efficitur augue. Phasellus mi nisl, interdum in tincidunt sit amet, dignissim vel ex. Maecenas ut tellus mattis, posuere dolor ac, elementum nisi. Duis aliquet ligula eu dui blandit, in efficitur tellus maximus.
    Morbi quis metus pretium, gravida sem rutrum, bibendum augue. Aliquam tincidunt commodo magna sed porttitor. Donec in turpis imperdiet, tempor neque a, luctus metus. Maecenas id nisi massa. Curabitur porttitor nibh mauris. Aenean eget arcu semper, convallis nunc ut, auctor magna. Sed feugiat nibh et justo ultricies feugiat.
    Nam cursus tristique diam vitae faucibus. Nullam faucibus ante a quam consectetur, et condimentum elit faucibus. Quisque fermentum pellentesque venenatis. Aliquam molestie ligula pellentesque, maximus purus ac, egestas nulla. Aenean semper efficitur enim, eu fermentum mi. Sed egestas ornare felis, ac tempor elit dapibus eu. Phasellus fringilla eget risus in feugiat. Suspendisse nunc neque, auctor non sodales at, vehicula sed lectus. Ut sed nunc sit amet velit eleifend elementum sit amet non turpis.
    Pellentesque vehicula erat vitae augue aliquam, eget dictum ipsum convallis. Sed id convallis ipsum. Etiam urna ligula, eleifend sit amet ante vel, laoreet ullamcorper ante. Donec non tortor dictum, sagittis sem et, dapibus elit. In condimentum velit nunc, nec blandit magna sodales at. Sed venenatis, lectus sit amet euismod facilisis, sem mauris maximus metus, et fermentum orci velit a diam. Integer a arcu velit. Aliquam vitae tortor quis libero congue commodo.`
  );
};

function generateLoremIpsumParagraph() {
  return generateLoremIpsum().split('\n')[0];
};

function generateLoremIpsumSentence() {
  return generateLoremIpsum().split('.')[0];
};

function generateRandomNumberOfLength(base = generateRandomDigit(), length = 0) {
  base = String(base);

  if (length <= 1) {
    return base;
  }
  
  base += generateRandomDigit();

  return generateRandomNumberOfLength(base, length-1);
};

function generateRandomEmail() {
  const user = 's'.repeat(generateRandomNumberBetween(1, 10));
  const domain = 's'.repeat(generateRandomNumberBetween(1, 10));
  const country = 's'.repeat(generateRandomNumberBetween(2, 3));

  const emailPattern = `${user}@${domain}.${country}`;
  console.log(emailPattern)

  return createRandomPatternInFormat(emailPattern);
};

function generateREGON(length = 9) {
  if (length !== 9 && length !== 14) {
    throw new Error('REGON lenght must be 9 or 14.');
  }

  let weights, regon = [], sum = 0;
  
  if(length == 9) {
    weights = [8, 9, 2, 3, 4, 5, 6, 7];
  } else {
    weights = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];
  }
  
  for (let i = 0; i < weights.length; i++) {
    regon[i] = Number(generateRandomDigit());
    sum += regon[i] * weights[i];
  }

  regon[weights.length + 1] = ((sum % 11 == 10) ? 0 : sum % 11);

  return regon.join("");
};
