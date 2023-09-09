/**
 * @typedef {Object} FlatArray
 * @property {Array} items - A one dimensional flattened array representing a 2d array in row-major order
 * @property {Object} shape - An object containing the dimensions of the 2d array.
 * @property {Number} shape.width - The width of the 2d array.
 * @property {Number} shape.height - The height of the 2d array.
 */

/**
 * Returns a *flat* 2d array created from the input string.
 * Expects rows are separated by new line characters.
 * Expects the 2d array to be square that is length = width.
 * @param {String} input - The input string to parse into a 2 dimensional array.
 * @param {String} rowSeparator - The character in the input which separates rows.
 * @param {Function} characterMapFn - Optional map function applied to each character.
 * @returns {FlatArray}
 */
export const parse2dArray = (input, characterMapFn = null, rowSeparator = '\n') => {
  const toReturn = [];
  const { length } = input;
  let rowCount = 0;

  for (let index = 0; index < length; index++) {
    const character = input[index];
    if (character !== rowSeparator) {
      toReturn.push(
        characterMapFn ? characterMapFn(character, toReturn.length) : character
      );
    } else {
      rowCount++;
    }
  }

  return {
    items: toReturn,
    shape: { width: Math.floor((length - rowCount) / rowCount), height: rowCount },
  };
};

/**
 * Convert an array of strings into a flat 2d array.
 * Each string in the array is considered a row, and each character of that string is treated as a column.
 * @param {String[]} array - Array of equal length strings to convert to a flat 2d array.
 * @param {(char:String, y:Number, x:Number) => String} characterMapFn - Invoked on each char of the string, returns the value of the char in the output array.
 * @returns {FlatArray}
 */
export const convertTo2dArray = (array, characterMapFn = (char, y, x) => char) => {
  if (!array.length) {
    return { items: [], shape: { width: 0, height: 0 } };
  }
  const height = array.length;
  const width = array[0].length;
  const toReturn = array.reduce((acc, row, y) => {
    if (row.length !== width) {
      throw new Error(
        `every row in 2d array must have the same width, expected: ${width} but received: ${row.width}`
      );
    }
    acc.push(
      ...(characterMapFn ? [...row].map((char, x) => characterMapFn(char, y, x)) : row)
    );
    return acc;
  }, []);

  return { items: toReturn, shape: { width, height } };
};

/**
 * Returns the index of the element in a *flattened* representation of the 2d array.
 * @param {Number} width - The number of elements in each row of the 2d array.
 * @param {Number} y - The y (row) index.
 * @param {Number} x - The x (col) index.
 */
export const index2d = (width, y, x) => width * y + x;

/**
 * Returns the coordinate (y,x) from the index of the element in a *flattened* representation of the 2d array.
 * @param {Number} width - The number of elements in each row of the 2d array.
 * @param {Number} index
 */
export const indexToCoordinate2d = (width, index) => ({
  y: Math.floor(index / width),
  x: index % width,
});

/**
 * Returns the element at <y,x> in the *flattened* 2d array.
 * @param {FlatArray} array - The flattened 2d array to extract the item from.
 * @param {Number} y - The y (row) index.
 * @param {Number} x - The x (col) index.
 */
export const elementAt2d = ({ items, shape: { width } }, y, x) =>
  items[index2d(width, y, x)];

/**
 * Returns all of the neighbors
 */
const neighbors2d = ({ items, shape: { width, height } }, y, x, neighborDeltas) =>
  neighborDeltas.reduce((neighbors, delta) => {
    const dY = delta.y + y;
    const dX = delta.x + x;
    if (dY >= 0 && dY < height && dX >= 0 && dX < width) {
      neighbors.push(items[index2d(width, dY, dX)]);
    }
    return neighbors;
  }, []);

/**
 * Array of offsets which can find a tiles N,S,E,W neighbors
 */
const cardinalNeighborDeltas = [
  { y: -1, x: 0 },
  { y: 1, x: 0 },
  { y: 0, x: 1 },
  { y: 0, x: -1 },
];

/**
 * Returns all of the N,S,E,W neighbors of the element at [y,x]
 * @param {FlatArray} array
 * @param {Number} y
 * @param {Number} x
 */
export const cardinalNeighbors2d = (array, y, x) =>
  neighbors2d(array, y, x, cardinalNeighborDeltas);

/**
 * Returns true if the point is is contained within the 2d array.
 * @param {Object} shape - The shape of the 2d array.
 * @param {Vector2} point - The point to test inclusion.
 * @returns
 */
export const isInBounds = ({ width, height }, { x, y }) =>
  x >= 0 && x < width && y >= 0 && y < height;

/**
 * Executes the function once per array element.
 * @param {FlatArray} array
 * @param {(element:any, y:Number, x:Number) => boolean} callbackFn - Function invoked for every element of the array. Can explicitly return false to stop evaluation.
 */
export const forEach2d = ({ items, shape: { width } }, callbackFn) => {
  for (let index = 0; index < items.length; index++) {
    const { y, x } = indexToCoordinate2d(width, index);
    const result = callbackFn(items[index], y, x);
    if (result === false) {
      break;
    }
  }
};

/**
 * Returns a new FlatArray object whose items have been populated with the results
 * of calling the map function on every element in the original array.
 * @param {FlatArray} array
 * @param {(element:any, y:Number, x:Number) => any} callbackFn - Function invoked for every element of the array, returns the mapped value.
 * @returns {FlatArray}
 */
export const mapPoints = (array, callbackFn) => {
  const srcItems = array.items;
  const destItems = Array(srcItems.length);
  for (let index = 0; index < srcItems.length; index++) {
    const { y, x } = indexToCoordinate2d(array.shape.width, index);
    destItems[index] = callbackFn(srcItems[index], y, x);
  }
  return { ...array, items: destItems };
};
