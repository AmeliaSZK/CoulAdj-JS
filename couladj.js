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

/** Process the source image and write the output.
 * 
 * @param {Event} evt 
 */
const okButtonClick = (evt) => {
  console.log('OK button clicked.');
  evt.stopPropagation(); // I don't know why my teacher said I need this
  evt.preventDefault(); // Needed to prevent the page from reloading
}

/** Copy the output to the clipboard
 * 
 * @param {Event} evt 
 */
const copyButtonClick = (evt) => {
  console.log('Copy to Clipboard button clicked.');
}

/** Open a Save File dialog to export the output in a TSV file.
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