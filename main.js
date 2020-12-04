/*  CoulAdj: Reads an image and outputs the colour adjacencies in a TSV format.
    Copyright (C) 2020  Amélia SZK

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/


// ██   ██  ██████   ██████  ██   ██ ███████ 
// ██   ██ ██    ██ ██    ██ ██  ██  ██      
// ███████ ██    ██ ██    ██ █████   ███████ 
// ██   ██ ██    ██ ██    ██ ██  ██       ██ 
// ██   ██  ██████   ██████  ██   ██ ███████ 
//                                           
// Ascii art from http://patorjk.com/software/taag/#p=display&f=ANSI%20Regular&t=HOOKS

/** There are 6 buttons on the page:
 *    - Choose File
 *    - Restore defaults
 *    - Ok
 *    - Reset
 *    - Copy to Clipboard
 *    - Download
 * 
 * Of those, (as far as I currently know) 3 need a JavaScript implementation:
 *    - Ok
 *    - Copy to Clipboard
 *    - Download
 */

/** To disable pesky verifications during development. Hopefully I remember to
 * turn it off before production lol.
 * 
 */
const DEV_MODE = true;

const activateDevMode = () => {
  console.log('Dev mode activated.');

  const chooseFileButton = document.getElementById('choose-file-button');
  const outputTextbox = document.getElementById('output-textbox');

  chooseFileButton.attributes.removeNamedItem('required');
  outputTextbox.attributes.removeNamedItem('readonly');
  outputTextbox.innerHTML = 'Hello Inner Text\n' + 'Next line?\n' + 'Tabs\t?\tHello';
}

/** Process the source image and write the output.
 * 
 * @param {Event} evt 
 * @returns `false` when an error occured. `true` otherwise.
 */
const okButtonClick = (evt) => {
  console.log('OK button clicked.');
  evt.stopPropagation(); // I don't know why my teacher said I need this
  evt.preventDefault(); // Needed to prevent the page from reloading.
  // preventDefault will also disable the default `required` verification!!

  const chosenFiles = document.getElementById('choose-file-button').files;
  console.log(chosenFiles);

  if(chosenFiles.length === 0) {
    console.error('A source image file is required.');
    return false;
  }

  const outputData = computeColourAdjacencies();
  console.log(outputData);

  return true;

}

/** Copy the output to the clipboard
 * 
 * @param {Event} evt 
 */
const copyButtonClick = (evt) => {
  console.log('Copy to Clipboard button clicked.');
  const outputTextbox = document.getElementById('output-textbox');
  outputTextbox.select();
  document.execCommand('copy');

}

/** Downloads the output as a TSV file.
 * 
 * @param {Event} evt 
 */
const downloadButtonClick = (evt) => {
  // Adapted from Rob Kendal's solution:
  // https://robkendal.co.uk/blog/2020-04-17-saving-text-to-client-side-file-using-vanilla-js

  console.log('Download button clicked.');

  const textToSave = document.getElementById('output-textbox').innerHTML; //maybe .value?
  const filename = 'colour-adjacencies.tsv';
  const mimeType = 'text/tab-separated-values';

  const a = document.createElement('a');
  const file = new Blob([textToSave], { type: mimeType });

  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();

  URL.revokeObjectURL(a.href);

}

const main = () => {
  console.log('main() started.');

  if (DEV_MODE) {
    activateDevMode();
  }

  document.getElementById('input-ok-button').addEventListener('click', okButtonClick);
  document.getElementById('output-copy-button').addEventListener('click', copyButtonClick);
  document.getElementById('output-download-button').addEventListener('click', downloadButtonClick);
}

document.addEventListener("DOMContentLoaded", main);


//  ██████  ██████  ██    ██ ██       █████  ██████       ██ 
// ██      ██    ██ ██    ██ ██      ██   ██ ██   ██      ██ 
// ██      ██    ██ ██    ██ ██      ███████ ██   ██      ██ 
// ██      ██    ██ ██    ██ ██      ██   ██ ██   ██ ██   ██ 
//  ██████  ██████   ██████  ███████ ██   ██ ██████   █████  
//
// Ascii art from http://patorjk.com/software/taag/#p=display&f=ANSI%20Regular&t=CoulAdj


const computeColourAdjacencies = () => {
  return 'hello';
}