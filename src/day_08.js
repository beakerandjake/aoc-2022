/**
 * Contains solutions for Day 8
 * Puzzle Description: https://adventofcode.com/2022/day/8
 */

/**
 * Returns an array of all characters in the input.
 * The array is a C contiguous 2d array.
 * @param {String} input
 * @returns {String[]}
 */
const parseInput = (input) => [...input].filter((x) => x !== '\n');

/**
 * Returns the value of the tree at the specified coordinate on the grid.
 * @param {Array} grid
 * @param {Number} length
 * @param {Number} rowIndex
 * @param {Number} colIndex
 */
const getTree = (grid, length, rowIndex, colIndex) => grid[rowIndex * length + colIndex];

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = (() => {
  /**
   * Iterate the row from left to right, visiting each item.
   * @param {Number} treeCount
   * @param {Number} rowIndex
   * @param {Function} visitFn
   */
  const iterateRow = (treeCount, rowIndex, visitFn) => {
    const innerWidth = treeCount - 1;
    for (let x = 1; x < innerWidth; x++) {
      visitFn(rowIndex, x);
    }
  };

  /**
   * Iterate the row from right to left, visiting each item.
   * @param {Number} treeCount
   * @param {Number} rowIndex
   * @param {Function} visitFn
   */
  const iterateRowReverse = (treeCount, rowIndex, visitFn) => {
    for (let x = treeCount - 2; x > 0; x--) {
      visitFn(rowIndex, x);
    }
  };

  /**
   * Iterate the column from top to bottom, visiting each item.
   * @param {Number} treeCount
   * @param {Number} rowIndex
   * @param {Function} visitFn
   */
  const iterateCol = (treeCount, colIndex, visitFn) => {
    const innerHeight = treeCount - 1;
    for (let y = 1; y < innerHeight; y++) {
      visitFn(y, colIndex);
    }
  };

  /**
   * Iterate the column from bottom to top, visiting each item.
   * @param {Number} treeCount
   * @param {Number} rowIndex
   * @param {Function} visitFn
   */
  const iterateColReverse = (treeCount, colIndex, visitFn) => {
    for (let y = treeCount - 2; y > 0; y--) {
      visitFn(y, colIndex);
    }
  };

  /**
   * Returns all of the edges from a given row/column index in the grid.
   * @param {Array} grid
   * @param {Number} length
   * @param {Number} index
   */
  const getEdges = (grid, length, index) => ({
    top: getTree(grid, length, 0, index),
    bottom: getTree(grid, length, length - 1, index),
    left: getTree(grid, length, index, 0),
    right: getTree(grid, length, index, length - 1),
  });

  /**
   * Given the length of a 2d grid, returns the number of visible edges.
   * @param {Number} length
   */
  const countVisibleEdges = (length) => length * 4 - 4;

  return ({ input, lines }) => {
    const grid = parseInput(input);
    const { length } = lines;
    const visibleTrees = new Set();

    const findVisibleTrees = (edge) => {
      let tallest = edge;
      return (y, x) => {
        const height = getTree(grid, length, y, x);
        if (height > tallest) {
          visibleTrees.add(`${y},${x}`);
          tallest = height;
        }
      };
    };

    // Instead of looking at each tree individually from its own perspective,
    // perform a "walk" around the grid looking inward and count each
    // tree visible from the "outside"
    for (let index = length - 2; index > 0; index--) {
      const edges = getEdges(grid, length, index);
      iterateRow(length, index, findVisibleTrees(edges.left));
      iterateRowReverse(length, index, findVisibleTrees(edges.right));
      iterateCol(length, index, findVisibleTrees(edges.top));
      iterateColReverse(length, index, findVisibleTrees(edges.bottom));
    }

    return countVisibleEdges(length) + visibleTrees.size;
  };
})();

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = (() => {
  const counter = (fn) => {
    const toReturn = (...args) => {
      toReturn.count++;
      return fn(...args);
    };
    toReturn.count = 0;
    return toReturn;
  };

  const lookUp = (y, x, visitFn) => {
    for (let index = y - 1; index >= 0; index--) {
      if (!visitFn(index, x)) {
        break;
      }
    }
  };

  const lookDown = (y, x, length, visitFn) => {
    for (let index = y + 1; index < length; index++) {
      if (!visitFn(index, x)) {
        break;
      }
    }
  };

  const lookRight = (y, x, length, visitFn) => {
    for (let index = x + 1; index < length; index++) {
      if (!visitFn(y, index)) {
        break;
      }
    }
    return visitFn;
  };

  const lookLeft = (y, x, visitFn) => {
    for (let index = x - 1; index >= 0; index--) {
      if (!visitFn(y, index)) {
        break;
      }
    }
  };

  const compareHeight = (grid, length, current) => (y, x) =>
    getTree(grid, length, y, x) < current;

  return ({ input, lines }) => {
    const grid = parseInput(input);
    const { length } = lines;
    let highestScenicScore = 0;

    for (let y = 0; y < length; y++) {
      for (let x = 0; x < length; x++) {
        const current = getTree(grid, length, y, x);
        const visitFn = compareHeight(grid, length, current);
        const leftCount = counter(visitFn);
        const rightCount = counter(visitFn);
        const upCount = counter(visitFn);
        const downCount = counter(visitFn);

        lookLeft(y, x, leftCount);
        lookRight(y, x, length, rightCount);
        lookUp(y, x, upCount);
        lookDown(y, x, length, downCount);

        const scenicScore =
          leftCount.count * rightCount.count * upCount.count * downCount.count;

        if (scenicScore > highestScenicScore) {
          highestScenicScore = scenicScore;
        }
      }
    }

    return highestScenicScore;
  };
})();
