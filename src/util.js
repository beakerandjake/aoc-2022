/**
 * Checks if value is between start and up to, but not including end.
 * @param {Number} value
 * @param {Number} start
 * @param {Number} end
 */
export const inRange = (value, start, end) => value >= start && value < end;

/**
 * Removes the first element of the array.
 * Does not mutate the original array but instead returns a new copy.
 * @param {Array} arr
 */
export const popHead = (arr) => arr.slice(1);

/**
 * Adds the element to the end of the array.
 * Does not mutate the original array but instead returns a new copy.
 * @param {Array} arr
 * @param {Any} item
 */
export const append = (arr, item) => [...arr, item];

/**
 * Sets the value of the element at the index.
 * Does not mutate the original array but instead returns a new copy.
 * @param {Array} array
 * @param {Number} index
 * @param {Any} value
 */
export const set = (array, index, value) => {
  const copy = [...array];
  copy[index] = value;
  return copy;
};

/**
 * Returns a *flat* 2d array created from the input string.
 * Expects rows are separated by new line characters.
 * Expects the 2d array to be square that is length = width.
 * @param {String} input - The input string to parse into a 2 dimensional array.
 * @param {String} rowSeparator - The character in the input which separates rows.
 * @param {Function} characterMapFn - Optional map function applied to each character.
 */
export const parse2dArray = (input, characterMapFn = null, rowSeparator = '\n') => {
  const toReturn = [];
  const { length } = input;
  let rowCount = 0;

  for (let index = 0; index < length; index++) {
    const character = input[index];
    if (character !== rowSeparator) {
      toReturn.push(characterMapFn ? characterMapFn(character) : character);
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
 * @param {Array} array -  The *flattened* 2d array.
 * @param {Object} shape - The shape of the 2d array (width and height)
 * @param {Number} shape.width - The number of elements in each row of the 2d array.
 * @param {Number} y - The y (row) index.
 * @param {Number} x - The x (col) index.
 */
export const elementAt2d = (array, { width }, y, x) => array[index2d(width, y, x)];

/**
 * Given an input string in the shape
 * @param {*} input
 * @returns
 */
export const getShape = (input) => ({ height: input.length, width: input[0].length });

/**
 * Returns all of the neighbors
 */
const neighbors2d = (grid, { width, height }, y, x, neighborDeltas) =>
  neighborDeltas.reduce((neighbors, delta) => {
    const dY = delta.y + y;
    const dX = delta.x + x;
    if (dY >= 0 && dY < height && dX >= 0 && dX < width) {
      neighbors.push(grid[index2d(width, dY, dX)]);
    }
    return neighbors;
  }, []);

/**
 * Returns all of the N,S,E,W neighbors of the element at [y,x]
 */
export const cardinalNeighbors2d = (() => {
  const deltas = [
    { y: -1, x: 0 },
    { y: 1, x: 0 },
    { y: 0, x: -1 },
    { y: 0, x: 1 },
  ];
  return (grid, shape, y, x) => neighbors2d(grid, shape, y, x, deltas);
})();

export const forEach2d = (array, { height, width }, callbackFn) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const result = callbackFn(array[index2d(width, y, x)], y, x);
      if (result === false) {
        break;
      }
    }
  }
};

/**
 * Converts the string to a number.
 * For speed not for sanity, this can easily fail if the string is not valid.
 * @param {String} x
 */
export const number = (x) => +x;

/**
 * Returns the result of the lhs added to the rhs.
 * @param {Number} a
 * @param {Number} b
 */
export const add = (a, b) => a + b;

/**
 * Returns the result of the lhs multiplied by the rhs.
 * @param {Number} a
 * @param {Number} b
 */
export const multiply = (a, b) => a * b;

/**
 * Match the string to the regex and return the first capture result.
 * @param {String} str
 * @param {RegExp} regex
 */
export const firstCapture = (str, regex) => str.match(regex)[1];
