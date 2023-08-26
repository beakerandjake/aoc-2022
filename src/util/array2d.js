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
 * Convert a regular 2d array into a flat 2d array.
 * @param {any[][]} array
 */
export const convertTo2dArray = (array) => {
  if (!array.length) {
    return { items: [], width: 0, height: 0 };
  }
  const height = array.length;
  const width = array[0].length;
  const toReturn = array.reduce((acc, row) => {
    if (row.length !== width) {
      throw new Error(
        `every row in 2d array must have the same width, expected: ${width} but received: ${row.width}`
      );
    }
    acc.push(...row);
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
 * @param {Array} array -  The *flattened* 2d array.
 * @param {Object} shape - The shape of the 2d array (width and height)
 * @param {Number} shape.width - The number of elements in each row of the 2d array.
 * @param {Number} y - The y (row) index.
 * @param {Number} x - The x (col) index.
 */
export const elementAt2d = (array, { width }, y, x) => array[index2d(width, y, x)];

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

/**
 * Functional iteration over a *flat* 2d array.
 * @param {Array} array
 * @param {Object} shape - The shape of the 2d array (width and height)
 * @param {Number} shape.width - The number of elements in each row of the 2d array.
 * @param {Number} shape.height - The number of elements in each column of the 2d array.
 * @param {Function} callbackFn - Function invoked for every element of the array.
 */
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
