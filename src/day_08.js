/**
 * Contains solutions for Day 8
 * Puzzle Description: https://adventofcode.com/2022/day/8
 */

const parseInput = (input) => [...input].filter((x) => x !== '\n');

const getTreeHeight = (grid, itemsPerRow, rowIndex, colIndex) =>
  grid[rowIndex * itemsPerRow + colIndex];

const countVisibleEdges = (length) => length * 4 - 4;

const treeId = (y, x) => `${y},${x}`;

const iterateRow = (grid, treeCount, rowIndex, visitFn) => {
  const innerWidth = treeCount - 1;
  for (let x = 1; x < innerWidth; x++) {
    visitFn(rowIndex, x, getTreeHeight(grid, treeCount, rowIndex, x));
  }
};

const iterateRowReverse = (grid, treeCount, rowIndex, visitFn) => {
  for (let x = treeCount - 2; x > 0; x--) {
    visitFn(rowIndex, x, getTreeHeight(grid, treeCount, rowIndex, x));
  }
};

const iterateColReverse = (grid, treeCount, colIndex, visitFn) => {
  for (let y = treeCount - 2; y > 0; y--) {
    visitFn(y, colIndex, getTreeHeight(grid, treeCount, y, colIndex));
  }
};

const iterateCol = (grid, treeCount, colIndex, visitFn) => {
  const innerHeight = treeCount - 1;
  for (let y = 1; y < innerHeight; y++) {
    visitFn(y, colIndex, getTreeHeight(grid, treeCount, y, colIndex));
  }
};

// top,bottom,left,right
const getEdges = (grid, treeCount, index) => [
  getTreeHeight(grid, treeCount, 0, index),
  getTreeHeight(grid, treeCount, treeCount - 1, index),
  getTreeHeight(grid, treeCount, index, 0),
  getTreeHeight(grid, treeCount, index, treeCount - 1),
];

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

  const checkIfTreeIsVisible = (edge) => {
    let tallest = edge;
    return (y, x, height) => {
      if (height > tallest) {
        visibleTrees.add(treeId(y, x));
        tallest = height;
      }
    };
  };

  const innerWidth = treeCount - 1;
  for (let index = 1; index < innerWidth; index++) {
    const [topEdge, bottomEdge, leftEdge, rightEdge] = getEdges(grid, treeCount, index);
    iterateRow(grid, treeCount, index, checkIfTreeIsVisible(leftEdge));
    iterateRowReverse(grid, treeCount, index, checkIfTreeIsVisible(rightEdge));
    iterateCol(grid, treeCount, index, checkIfTreeIsVisible(topEdge));
    iterateColReverse(grid, treeCount, index, checkIfTreeIsVisible(bottomEdge));
  }

  return countVisibleEdges(treeCount) + visibleTrees.size;
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
