/**
 * Contains solutions for Day 8
 * Puzzle Description: https://adventofcode.com/2022/day/8
 */

/**
 * Returns an array of all characters in the input.
 * The array is a C contiguous 2d array.
 */
const parseInput = (input = '') => [...input].filter((x) => x !== '\n');

/**
 * Returns the value of the tree at the specified coordinate on the grid.
 */
const getTree = (grid, length, rowIndex, colIndex) => grid[rowIndex * length + colIndex];

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = (() => {
  /**
   * Iterates from start to end, invoking the function each iteration.
   */
  const iterate = (start, end, increment, visitFn) => {
    let index = start;
    while (index !== end) {
      visitFn(index);
      index += increment;
    }
  };

  /**
   * Iterate the row from left to right, visiting each item.
   */
  const iterateRow = (length, rowIndex, visitFn) =>
    iterate(1, length - 1, 1, (index) => visitFn(rowIndex, index));

  /**
   * Iterate the row from right to left, visiting each item.
   */
  const iterateRowReverse = (length, rowIndex, visitFn) =>
    iterate(length - 2, -1, -1, (index) => visitFn(rowIndex, index));

  /**
   * Iterate the column from top to bottom, visiting each item.
   */
  const iterateCol = (length, colIndex, visitFn) =>
    iterate(1, length - 1, 1, (index) => visitFn(index, colIndex));

  /**
   * Iterate the column from bottom to top, visiting each item.
   */
  const iterateColReverse = (length, colIndex, visitFn) =>
    iterate(length - 2, -1, -1, (index) => visitFn(index, colIndex));

  /**
   * Returns all of the edges from a given row/column index in the grid.
   */
  const getEdges = (grid, length, index) => ({
    top: getTree(grid, length, 0, index),
    bottom: getTree(grid, length, length - 1, index),
    left: getTree(grid, length, index, 0),
    right: getTree(grid, length, index, length - 1),
  });

  /**
   * Given the length of a 2d grid, returns the number of visible edges.
   */
  const countVisibleEdges = (length) => length * 4 - 4;

  return ({ input = '', lines = [] }) => {
    const grid = parseInput(input);
    const { length } = lines;
    const visibleTrees = new Set();

    // define here to capture a reference to the set so it can be updated.
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
 */
export const levelTwo = (() => {
  /**
   * Iterates from start to end, invoking the function each iteration.
   * @param {Number} start - The start index
   * @param {Number} end - The end index.
   * @param {Number} increment - The amount to increment the index each iteration.
   * @param {Function} visitFn - The function invoked every iteration, can return false to halt the loop.
   * @returns {Number} The number of times the visitFn was called.
   */
  const iterate = (start, end, increment, visitFn) => {
    let visitCount = 0;
    let index = start;
    while (index !== end) {
      visitCount++;
      if (!visitFn(index)) {
        break;
      }
      index += increment;
    }
    return visitCount;
  };

  /**
   * Iterate up column x starting from [y,x]
   */
  const up = (y, x, visitFn) => iterate(y - 1, -1, -1, (index) => visitFn(index, x));

  /**
   * Iterate down column x starting from [y,x]
   */
  const down = (y, x, length, visitFn) =>
    iterate(y + 1, length, 1, (index) => visitFn(index, x));

  /**
   * Iterate left across row y starting from [y,x]
   */
  const left = (y, x, visitFn) => iterate(x - 1, -1, -1, (index) => visitFn(y, index));

  /**
   * Iterate right across row y starting from [y,x]
   */
  const right = (y, x, length, visitFn) =>
    iterate(x + 1, length, 1, (index) => visitFn(y, index));

  /**
   * Generate the scenic score for tree at [y,x] based on total visible trees in each direction.
   */
  const getScenicScore = (grid, length, y, x) => {
    const current = getTree(grid, length, y, x);
    const isShorterThanCurrent = (...args) => getTree(grid, length, ...args) < current;
    return (
      left(y, x, isShorterThanCurrent) *
      right(y, x, length, isShorterThanCurrent) *
      up(y, x, isShorterThanCurrent) *
      down(y, x, length, isShorterThanCurrent)
    );
  };

  return ({ input = '', lines = [] }) => {
    const grid = parseInput(input);
    const { length } = lines;
    let highest = 0;

    const innerLength = length - 1;
    for (let y = 1; y < innerLength; y++) {
      for (let x = 1; x < innerLength; x++) {
        const score = getScenicScore(grid, length, y, x);
        if (score > highest) {
          highest = score;
        }
      }
    }

    return highest;
  };
})();
