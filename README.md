# Serial Filler

> Filling forms with fake, non-trivial (valid PESEL, KRS, ISBN-13 etc.) data for developing
purposes.

Repository with source code of [Serial Filler](https://chrome.google.com/webstore/detail/serial-filler/fbkfkboplgphbjlfcnmkphochacophjc).

## Contribution
_Note:_ This guide is targeted for Chrome web browser, but you can install and develop this extension
with any browser compatibile with [WebExtension API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions).

### Instalation
1. Clone this repository.
2. Go to [chrome://extensions](chrome://extensions).
3. Ensure that the Developer mode checkbox in the top right-hand corner is checked.
4. Click on *Load unpacked extensions...* from to left corner.

Now you should see Serial Filler on top of your extensions list.

_PS: This instruction is valid for  Chrome Version `60.0.*`. Here you can find official instruction by Google: [Load the extension](https://developer.chrome.com/extensions/getstarted#unpacked)._

### Adding new generator
Let's assume we want to autofill every input with our _**Hogwarts ID**_. Rules of valid Hogwarts ID 
are simple: number should starts with any `four digit` and ends with string `AGKS`.

First, we need to add generator function to `src/generators.js`:
```js
function generateHogwardsId() {
  const randomlyChosenDigits = '8342';
  const hardcodedSufix = 'AGKS';
  const hogwardsId = randomlyChosenDigits + hardcodedSufix;

  return hogwardsId;
};
```

Then, we need bind our generator function to contex menu, so the user could select it
upon request. To do this, edit `src/menu-bindings.js`:

```js
  (...)
  generator: generateCoordinates,
    keywords: ['coordinates', 'latlng', 'coords']
  },

  // [THIS CODE IS ADDED]
  {
    id: 'hogwards-id',
    title: 'Hogwards ID',
    generator: generateHogwardsId,
    keywords: ['hogwards-id', 'hogwardsId', 'hogwards-number']
  }
  // [THIS CODE IS ADDED]
];
```
Let's describe what it's mean:

* `id` - unique identificator of menu item. It should be *different* than any existing in `src/menu-binging.js` file.
* `title` - string displayed to user in menu.
* `generator` - function that should be used to fill specific input.
* `keywords` - arrays of keywords that will be used by Serial Filler during determination
which field should be filled with which generator.

At the end you should add some kind of _test suite_ to `test/sugestions-by-id.html`:

```html
(...)
<div class="test-step">
  <h2>Coordinates</h2>
  <input type="text" id="coordinates" />
</div>

<!--THIS CODE WAS ADDED -->
<div class="test-step">
  <h2>Hogwards ID</h2>
  <input type="text" id="hogwards-id" />
</div>
<!--/THIS CODE WAS ADDED -->

<div>
  <button type="submit">submit</button>
</div>
(...)
 ```

 The `id="hogwards-id"` you added is enough for Serial Filler to guess it should use `generateHogwardsId`
 function you provided. Now, being on [chrome://extensions](chrome://extensions), click *Reload* button
 in Serial Filler section (to load changes you made) and then open `test/sugestions-by-id.html` in new tab
 in your browser. 
 
 You should see test suits for every field that Serial Filler can fill including brand new
 Hogwards ID you've just added. Now, after pressing Serial Filler icon in top right corner of your browser,
 Hogward ID input should be filled with value `8342AGKS`.
