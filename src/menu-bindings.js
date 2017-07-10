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
    generator: generatePhoneNumber,
    keywords: ['phone', 'mobile-phone'],
  },

  {
    id: 'phone_b',
    parentId: 'phones',
    title: 'Numer telefonu jako 2549923',
    generator: generatePhoneNumber,
    keywords: ['landline-phone'],
  },

  {
    id: 'email',
    title: 'Email',
    generator: generateRandomEmail,
    keywords: ['email'],
  },

  {
    id: 'addresses',
    title: 'Adres',
    generator: generateAddress,
    keywords: ['address', 'adres', 'zamieszkanie', 'meldunek'],
  },

  {
    id: 'street',
    parentId: 'addresses',
    title: 'Ulica',
    generator: generateStreet,
    keywords: ['street', 'ulica', 'avenue', 'aleja'],
  },

  {
    id: 'city',
    parentId: 'addresses',
    title: 'Nazwa miasta',
    generator: generateCity,
    keywords: ['city', 'miasto'],
  },

  {
    id: 'zip_code',
    parentId: 'addresses',
    title: 'Kod pocztowy',
    generator: generateZipCode,
    keywords: ['zipcode', 'zip_code'],
  },

  {
    id: 'address',
    parentId: 'addresses',
    title: 'Pełny adres',
    generator: generateAddress,
    keywords: ['address', 'zamieszkanie'],
  },

  {
    id: 'name',
    title: 'Imię, nazwisko lub nick',
    generator: generateName,
    keywords: ['name', 'nick', 'login', 'user', 'imie', 'ksywa'],
  },

  {
    id: 'sentence',
    title: 'Jedno zdanie',
    generator: generateLoremIpsumSentence,
    keywords: ['sentence','bio', 'interests'],
  },

  {
    id: 'paragraph',
    title: 'Cały akapit',
    generator: generateLoremIpsumParagraph,
    keywords: ['paragraph', 'comment'],
  },

  {
    id: 'many_paragraphs',
    title: 'Kilka akapitów',
    generator: generateLoremIpsum,
    keywords: [],
  },

  {
    id: 'imei',
    title: 'Numer IMEI',
    generator: generateIMEI,
    keywords: ['imei'],
  },

  {
    id: 'isbns',
    title: 'Numer ISBN',
    generator: generateISBN13,
    keywords: ['isbn'],
  },

  {
    id: 'isbn10',
    parentId: 'isbns',
    title: 'ISBN-10',
    generator: generateISBN10,
    keywords: ['isbn-10', 'isbn10']
  },

  {
    id: 'isbn13',
    parentId: 'isbns',
    title: 'ISBN-13',
    generator: generateISBN13,
    keywords: ['isbn-13', 'isbn13']
  },

  {
    id: 'ipv4',
    // parentId: 'isbns',
    title: 'IPv4',
    generator: generateIPv4,
    keywords: ['ip', 'ipv4', 'ip-v4']
  },

  {
    id: 'coordinates',
    title: 'Coordinates',
    generator: generateCoordinates,
    keywords: ['coordinates', 'latlng', 'coords']
  },

];
