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

  if (chosenFiles.length === 0) {
    console.error('A source image file is required.');
    return false;
  }

  const image = new PixelArray(chosenFiles[0], {}, console.error);
  setTimeout(console.log, 0, 'setTimeout in okButtonClick');

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


const DiagonalsSettings = {
  ADJACENT: 'adjacent',
  UNRELATED: 'unrelated'
}

const IncludeAlphaSettings = {
  WHEN_PRESENT: 'when-present',
  WHEN_RELEVANT: 'when-relevant',
  ALWAYS: 'always'
}


class PixelArray {

  /** Creates and initializes a PixelArray from an image File.
   * 
   * @param {File} source The image file to process
   * @param {Object} options Optional settings.
   * @param {string} options.diagonals A value from DiagonalsSettings.
   * @param {string} options.includeAlpha A value from IncludeAlphaSettings.
   * @param {Function} logError A function that takes a string in argument. Used to report error messages.
   */
  constructor(source, options, logError) {
    this.source = source;
    this.diagonals = options.diagonals ?? DiagonalsSettings.ADJACENT;
    this.includeAlpha = options.includeAlpha ?? IncludeAlphaSettings.WHEN_RELEVANT;
    this.logError = logError ?? console.error;
    // All those variables initialized to -1 are given their actual value
    //  in extractImageData. Yes, I know I (probably) shouldn't be doing it 
    //  like this.
    this.height = -1;
    this.width = -1;
    this.maxRow = -1;
    this.maxColumn = -1;
    this.maxPixel = -1;
    this.imageData = this.extractImageData(this.source);
    this.adjacencies = new Set();
    this.results = '';

  }

  /**
   * 
   * @param {File} source 
   */
  extractImageData(source) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // My shit finally works :')
    // We even got the correct height and width now :')
    const imgData = createImageBitmap(source)
      .then(bitmap => {
        context.drawImage(bitmap, 0, 0);
        return bitmap;
      })
      .then((bitmap) => context.getImageData(0, 0, bitmap.height, bitmap.width))
      .then(imgDt => {
        this.height = imgDt.height;
        this.width = imgDt.width;
        this.maxRow = this.height - 1;
        this.maxColumn = this.width - 1;
        this.maxPixel = this.height * this.width - 1;
        console.log('this.height = ' + this.height);
        console.log('this.width = ' + this.width);
        console.log('this.maxRow = ' + this.maxRow);
        console.log('this.maxColumn = ' + this.maxColumn);
        console.log('this.maxPixel = ' + this.maxPixel);
        this.startProcessingPixels();
        return imgDt;
      });

    return imgData;
  }

  /** Decides how many pixels per batch to process, and starts the processing.
   * 
   */
  startProcessingPixels() {
    console.log('Entered startProcessingPixels');
    const batchSize = 1 * 1000 * 1000; // Written like this for clarity.
    console.log('batchSize = ' + batchSize.toLocaleString());

    const firstIndex = 0; // To avoid confusion with the 0 delay below
    setTimeout(this.processManyPixels(firstIndex, batchSize), 0);
  }

  /**
   * 
   * @param {Number} pixel Index of the pixel to process
   */
  processManyPixels(startPixel, nbPixels) {
    console.log('Entered processManyPixels. start = ' + startPixel);

    // # Stop condition(s) #
    if (startPixel > this.maxPixel) {
      console.log('Stopping processManyPixels.');
      setTimeout(this.stringify(), 0);
      return;
    }

    // # Initializations #
    const naiveLastPixel = startPixel + nbPixels - 1;
    const lastPixel = naiveLastPixel <= this.maxPixel ? naiveLastPixel : this.maxPixel;

    // # Process the current batch #
    for (let pixel = startPixel; pixel <= lastPixel; pixel++) {
      this.processOnePixel(pixel);
    }

    // # Queue the next batch #
    setTimeout(this.processManyPixels(lastPixel + 1, nbPixels), 0);
  }

  processOnePixel(pixel) {
    if (pixel % (1 * 1000 * 1000) === 0) {
      console.log('Starting pixel ' + pixel.toLocaleString());
    }

  }

  /** Decides if the alpha column should be included.
   * 
   * Currently always return true because the available image libraries don't
   * say if the original image had an alpha channel.
   * 
   */
  decideAlpha() {
    return true;
  }

  stringify() {
    console.log('Starting stringifyWhole');

    const adjacencies = Array.from(this.adjacencies.keys());
    adjacencies.sort(Colour.compareAdjacency);

    const includeAlpha = this.decideAlpha();

    let output = new Array();

    const header = includeAlpha ? RBGALPHA_HEADER : RBG_HEADER;
    const stringify = includeAlpha ? Colour.adjacencyToRgbAlphaString : Colour.adjacencyToRgbString;

    output.push(header);
    adjacencies.forEach(adjacency => output.push(stringify(adjacency)));

    this.results = output.join('\n');
    console.log('Results :');
    console.log(this.results);

    setTimeout(this.showResults(), 0);
  }

  showResults() {
    // TODO: Fix this monstrous hack
    const outputTextbox = document.getElementById('output-textbox');
    outputTextbox.innerHTML = this.results;
  }

}

/** The separator is hardcoded to deter from supporting CSV in the future.
 * 
 * Because the comma is used as the decimal separator in some locales, CSV files
 *  can have a semicolon separator instead of the comma.
 * 
 * Hence, we consider the CSV format to be less reliable than TSV.
 * 
 * Because our outputs are expected to be processed by programming languages
 *  where hardcoded parameters abound, we decided to priorize the reliability
 *  of our output over the convenience of the option of a CSV output.
 * 
 * Specifically, this means that we consider a future support of CSV format
 *  as a *bad* development.
 * 
 * Hence, we are hardcoding the tab separator as a final warning against
 *  supporting the CSV format.
 * 
 * 
 * Or... that was what we initially planned to do.
 * 
 * Until we realized we trusted our future judgement more than our current
 *  judgement.
 * 
 */
const COLUMN_SEPARATOR = '\t';

/** DO NOT CHANGE THESE HEADERS
 * 
 * These headers are part of the API defined in the Readme.
 * They MUST NOT be changed unless the major version number is incremented.
 * 
 * The outputted files are meant to be parsed by programs that rely on
 *    hardcoded column names.
 * 
 * THE NAMES OF THE COLUMNS, AND THE ORDER IN WHICH THEY ARE WRITTEN,
 *    ARE THE MOST CRITICAL PART OF THE API.
 * 
 * DO NOT CHANGE
 * 
 * DO NOT CHANGE
 */
const RBG_HEADER = ['r', 'g', 'b', 'adj_r', 'adj_g', 'adj_b'].join(COLUMN_SEPARATOR);
const RBGALPHA_HEADER = ['r', 'g', 'b', 'a', 'adj_r', 'adj_g', 'adj_b', 'adj_a'].join(COLUMN_SEPARATOR);
// RgbAplha instead of Rgba to avoid unnoticed typos.

class Colour {

  constructor() { }

  /** Brings an Uint8ClampedArray of 8 elements to an RGB string of 6 columns
   * 
   * @param {Uint8ClampedArray} adj 
   */
  static adjacencyToRgbString(adj) {
    // Notice that we are skipping adj[3] and adj[7]
    return [adj[0], adj[1], adj[2], adj[4], adj[5], adj[6]].join(COLUMN_SEPARATOR);
  }

  /** Brings an Uint8ClampedArray of 8 elements to an RgbAlpha string of 8 columns
   * 
   * @param {Uint8ClampedArray} adj 
   */
  static adjacencyToRgbAlphaString(adj) {
    return adj.join(COLUMN_SEPARATOR);
  }

  /** Compares two Uint8ClampedArray with exactly 4 elements each.
   * 
   * @param {Uint8ClampedArray} a 
   * @param {Uint8ClampedArray} b 
   */
  static compare(a, b) {
    /** This function is expected to be the most called in the whole program,
     * and we want to be able to process inputs with millions of pixels.
     * 
     * Hence, we want this function to be *fast*
     * 
     * The first implementation was using bitwise operators in hope that
     * the runtime engine will be smart enough to see that we are treating
     * four consecutive unsigned 8-bit integers as a single unsigned 32-bit.
     * 
     * It failed because it evaluated [255,0,0,0] as lesser than [0,255,0,0]
     * 
     * The current implementation doesn't have this problem.
     */

    if (a[0] !== b[0]) {
      return a[0] - b[0];

    } else if (a[1] !== b[1]) {
      return a[1] - b[1];

    } else if (a[2] !== b[2]) {
      return a[2] - b[2];

    } else {
      return a[3] - b[3];
    }
  }

  /** Compares two Uint8ClampedArray with exactly 8 elements each.
   * 
   * @param {Uint8ClampedArray} a 
   * @param {Uint8ClampedArray} b 
   */
  static compareAdjacency(a, b) {
    const comp1 = Colour.compare(a.slice(0, 4), b.slice(0, 4));
    if (comp1 !== 0) {
      return comp1;

    } else {
      return Colour.compare(a.slice(4, 8), b.slice(4, 8));
    }

  }


}



const computeColourAdjacencies = () => {
  return 'hello';
}