function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

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

function generateRandomFloatBetween(from, to, fixed) {
  return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
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

  return regon.join('');
};

function shuffleArray(array = []) {
  let shuffled = array.slice();
  let counter = shuffled.length;

  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;

    [shuffled[counter], shuffled[index]] = [shuffled[index], shuffled[counter]];
  };

  return shuffled;
};


function generateNIP() {
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let numbers = [0, 1, 2, 3, 4,5 ,6 ,7 ,8 ,9];
  let nip = [], sum;
  
  do {
    numbers = shuffleArray(numbers);
    nip = numbers.slice(0, 9);
    sum = 0;

    for (let i = 0; i < weights.length; i++) {
      sum += nip[i] * weights[i];
    }

    nip[9] = (sum % 11);
  } while (nip[9] === 10);

  return nip.join('');
};

function generatePLIDNumber() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const weights = [7, 3, 1, 0, 7, 3, 1, 7, 3];
  let idArr = [];
  let sum = 0;

  idArr[0] = 'A';
  sum += ((letters.indexOf(idArr[0]) + 10) * weights[0]);
  
  idArr[1] = shuffleArray(letters)[0];
  sum += ((letters.indexOf(idArr[1]) + 10) * weights[1]);
  
  idArr[2] = shuffleArray(letters)[0];
  sum += ((letters.indexOf(idArr[2]) + 10) * weights[2]);
  
  for(let i = 4; i <= 8; i++) {
    idArr[i] = Math.floor(Math.random() * 10);
    sum += idArr[i] * weights[i];
  }
  
  idArr[3] = sum % 10;

  return idArr.join('');  
};

function generateKRS() {
  const leadingZeros = generateRandomNumberBetween(1, 5);
  let krs = '0'.repeat(leadingZeros);

  while (krs.length < 10) {
    krs += generateRandomDigit();
  }

  return krs;
};

function generateStreet() {
  const streetPattern = 's'.repeat(generateRandomNumberBetween(7, 15));
  let street = createRandomPatternInFormat(streetPattern);
  street = capitalizeFirstLetter(street);

  return street;
};

function generateZipCode() {
  return createRandomPatternInFormat('dd-ddd');
};

function generateCity() {
  const twoPart = (Math.floor(Math.random()*10))%2;
  let cityPattern = 's'.repeat(generateRandomNumberBetween(6, 15));

  if (twoPart) {
    cityPattern += ' ';
    cityPattern += 's'.repeat(generateRandomNumberBetween(6, 15));
  } 

  let city = createRandomPatternInFormat(cityPattern);
  city = city.split(' ').map(capitalizeFirstLetter).join(' ');

  return city;
};

function generateAddress() {
  const city = generateCity();
  const street = generateStreet();
  const zipCode = generateZipCode();
  const streetNr = generateRandomNumberBetween(1, 400);
  const buildingNr = generateRandomNumberBetween(1, 400);

  return `${street} ${streetNr}, ${buildingNr},
    ${zipCode}, ${city}
  `;
};

function generateName(length = 7) {
  const namePattern = 's'.repeat(generateRandomNumberBetween(4, 10));
  let name = createRandomPatternInFormat(namePattern);
  name = capitalizeFirstLetter(name);

  return name;
};

function generatePhoneNumber() {
  const leadingNumber = generateRandomNumberBetween(1, 9);
  const rest = createRandomPatternInFormat('dddddd');

  return leadingNumber + rest;
};

function generateIMEI() {
  const rbi = ['01', '10', '30', '33', '35', '44', '45', '49', '50', '51', '52', '53', '54', '86', '91', '98', '99'];
  const arr = rbi[Math.floor(Math.random() * rbi.length)].split('');
  let imeiLength = 15;
  let sum = 0;
  let position = 2;
  let offset = 0;
  let imeiAsString = new Array(0).fill(15);

  imeiAsString[0] = Number(arr[0]);
  imeiAsString[1] = Number(arr[1]);

  while (position < imeiLength - 1) {
    imeiAsString[position++] = Math.floor(Math.random() * 10) % 10;
  }

  offset = (imeiLength + 1) % 2;

  let imei = 0;

  for (position = 0; position < imeiLength - 1; position++) {
    if ((position + offset) % 2) {
      imei = imeiAsString[position] * 2;

      if (imei > 9) {
          imei -= 9;
      }

      sum += imei;
    } else {
      sum += imeiAsString[position];
    }
  }

  const lastDigit = (10 - (sum % 10)) % 10;
  imeiAsString[imeiLength - 1] = lastDigit;

  imei = imeiAsString.join('');
  imei = imei.substr(0, imeiLength);

  return imei;
};

function generateISBN10() {
  const SPARATOR = '-';
  const countryCodePattern = 'd'.repeat(generateRandomNumberBetween(1, 5));
  const publisherCodePattern = 'd'.repeat(generateRandomNumberBetween(1, 5));
  const publicationCodePattern = 'd'.repeat(generateRandomNumberBetween(1, 5));

  let ISBN10 = [
    countryCodePattern,
    publisherCodePattern,
    publicationCodePattern,
  ]
    .map(createRandomPatternInFormat)
    .join(SEPARATOR)
    .concat(SEPARATOR);

  ISBN10
    .concat(calculateISBN10CheckSum(ISBN10))
    .join('');

  return ISBN10;
};

function calculateISBN10CheckSum(isbnWithoutCheckSum) {
  const cleardISBN10 = String(isbnWithoutCheckSum).replace(/-/ig, '');
  const ISBN10AsArray = Array.from(cleardISBN10);
  const sumByPosition = ISBN10AsArray.reduce((sum, num, index) => {
    sum += parseInt(num, 10) * (index + 1);
    return sum;
  }, 0);

  return sumByPosition % 11;
};

function generateISBN10(withISBNText = false) {
  const SEPARATOR = '-';
  const countryCode = createRandomPatternInFormat('d'.repeat(2));
  const publisherCode = createRandomPatternInFormat('d'.repeat(4));
  const publicationCode = createRandomPatternInFormat('d'.repeat(3));

  let ISBN10 = [
    countryCode,
    publisherCode,
    publicationCode
  ]
    .join(SEPARATOR)
    .split('')
    .concat(SEPARATOR);

  const sum = calculateISBN10CheckSum(ISBN10, SEPARATOR);

  ISBN10 = ISBN10
    .concat(sum)
    .join('');

  if (withISBNText) {
    ISBN10 = 'ISBN ' + ISBN10;
  }

  return ISBN10;
};

function calculateISBN10CheckSum(isbnWithoutCheckSum) {
  const cleardISBN10 = String(isbnWithoutCheckSum).replace(/\D/ig, '');
  const ISBN10AsArray = Array.from(cleardISBN10);

  const sumByPosition = ISBN10AsArray.reduce((sum, num, index) => {
    sum += parseInt(num, 10) * (index + 1);
    return sum;
  }, 0);

  return sumByPosition % 11;
};

function generateISBN13(withISBNText = false) {
  const STANDARD_PREFIX = 978;
  const SEPARATOR = '-';
  const countryCode = createRandomPatternInFormat('d'.repeat(2));
  const publisherCode = createRandomPatternInFormat('d'.repeat(4));
  const publicationCode = createRandomPatternInFormat('d'.repeat(3));

  let ISBN13 = [
    STANDARD_PREFIX,
    countryCode,
    publisherCode,
    publicationCode
  ]
    .join(SEPARATOR)
    .split('')
    .concat(SEPARATOR);

  const sum = calculateISBN13CheckSum(ISBN13, SEPARATOR);

  ISBN13 = ISBN13
    .concat(sum)
    .join('');

  if (withISBNText) {
    ISBN13 = 'ISBN ' + ISBN13;
  }

  return ISBN13;
};

function calculateISBN13CheckSum(isbnWithoutCheckSum) {
  const cleardISBN13 = String(isbnWithoutCheckSum).replace(/\D/ig, '');
  const ISBN13AsArray = Array.from(cleardISBN13);

  const getDigitWeigth = (position, digit) => {
    const forOdd = 1;
    const forEven = 3;
    const isEven = (n) => n % 2 === 0;
    const weigth = isEven(position) ? forEven : forOdd;

    return weigth;
  };

  const sumByPosition = ISBN13AsArray.reduce((sum, digit, index) => {
    digit = parseInt(digit, 10);
    const position = index + 1;
    const weight = getDigitWeigth(position, digit);

    sum += digit * weight;

    return sum;
  }, 0);

  let checkSum = sumByPosition % 10;
  checkSum = 10 - checkSum;
  checkSum = checkSum % 10;

  return checkSum;
};

function generateIPv4() {
  const segments = [
    generateRandomNumberBetween(190, 255),
    generateRandomNumberBetween(0, 10),
    generateRandomNumberBetween(1, 13),
    generateRandomNumberBetween(190, 255),
  ]; 

  const ipv4 = segments.join('.');
  return ipv4;
};

function generateCoordinates() {
  const segments = [
    generateRandomFloatBetween(-90, 90, 3),
    generateRandomFloatBetween(-180, 180, 3),
  ];
  const coordiantes = segments.join(',');
  return coordiantes;
};
