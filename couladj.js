/* There are 6 buttons on the page:
- Choose File
- Restore defaults
- Ok
- Reset
- Copy to clipboard
- Save As...

Of those, (as far as I currently know) 3 need a JavaScript implementation:
- Ok
- Copy to clipboard
- Save As...
*/

/**
 * 
 * @param {Event} evt 
 */
const okButtonClick = (evt) => {
  console.log('OK button clicked.');
  evt.stopPropagation(); // I don't know why my teacher said I need this
  evt.preventDefault(); // Needed to prevent the page from reloading
}

/**
 * 
 * @param {Event} evt 
 */
const copyButtonClick = (evt) => {
  console.log('Copy to Clipboard button clicked.');
}

/**
 * 
 * @param {Event} evt 
 */
const saveAsButtonClick = (evt) => {
  console.log('Save As button clicked.');
}

const main = () => {
  console.log('main() started.');

  document.getElementById('input-ok-button').addEventListener('click', okButtonClick);
  document.getElementById('output-copy-button').addEventListener('click', copyButtonClick);
  document.getElementById('output-saveas-button').addEventListener('click', saveAsButtonClick);
}

document.addEventListener("DOMContentLoaded", main);