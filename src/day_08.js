/**
 * Contains solutions for Day 8
 * Puzzle Description: https://adventofcode.com/2022/day/8
 */

const parseInput = (input) => [...input].filter((x) => x !== '\n');

const iterateRow = (treeCount, rowIndex, visitFn) => {
  const innerWidth = treeCount - 1;
  for (let x = 1; x < innerWidth; x++) {
    visitFn(rowIndex, x);
  }
};

const iterateRowReverse = (treeCount, rowIndex, visitFn) => {
  for (let x = treeCount - 2; x > 0; x--) {
    visitFn(rowIndex, x);
  }
};

const iterateColReverse = (treeCount, colIndex, visitFn) => {
  for (let y = treeCount - 2; y > 0; y--) {
    visitFn(y, colIndex);
  }
};

const iterateCol = (treeCount, colIndex, visitFn) => {
  const innerHeight = treeCount - 1;
  for (let y = 1; y < innerHeight; y++) {
    visitFn(y, colIndex);
  }
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  const grid = parseInput(input);
  const treeCount = lines.length; // assuming grid is square of NxN trees.
  const visibleTrees = new Set();

  const getTree = (rowIndex, colIndex) => grid[rowIndex * treeCount + colIndex];

  const findVisibleTrees = (edge) => {
    let tallest = edge;
    return (y, x) => {
      const height = getTree(y, x);
      if (height > tallest) {
        visibleTrees.add(`${y},${x}`);
        tallest = height;
      }
    };
  };

  const innerWidth = treeCount - 1;
  for (let index = 1; index < innerWidth; index++) {
    // look at row from left to right, starting at left most edge.
    iterateRow(treeCount, index, findVisibleTrees(getTree(index, 0)));
    // look at row from right to left, starting at right most edge.
    iterateRowReverse(treeCount, index, findVisibleTrees(getTree(index, treeCount - 1)));
    // look at column from top to bottom, starting at top most edge.
    iterateCol(treeCount, index, findVisibleTrees(getTree(0, index)));
    // look at column from bottom to top, starting at bottom most edge.
    iterateColReverse(treeCount, index, findVisibleTrees(getTree(treeCount - 1, index)));
  }

  return treeCount * 4 - 4 + visibleTrees.size;
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
