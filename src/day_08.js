/**
 * Contains solutions for Day 8
 * Puzzle Description: https://adventofcode.com/2022/day/8
 */

const parseInput = (input) => [...input].filter((x) => x !== '\n');

const getTreeHeight = (grid, rowCount, rowIndex, colIndex) =>
  grid[rowIndex * rowCount + colIndex];

const countVisibleEdges = (height) => height * 4 - 4;

const treeId = (y, x) => `${y},${x}`;

const iterateRow = (grid, [gridHeight, gridWidth], rowIndex, visitFn) => {
  const innerWidth = gridWidth - 1;
  for (let x = 1; x < innerWidth; x++) {
    visitFn(rowIndex, x, getTreeHeight(grid, gridHeight, rowIndex, x));
  }
};

const iterateRowReverse = (grid, [gridHeight, gridWidth], rowIndex, visitFn) => {
  for (let x = gridWidth - 2; x > 0; x--) {
    visitFn(rowIndex, x, getTreeHeight(grid, gridHeight, rowIndex, x));
  }
};

const iterateColReverse = (grid, [gridHeight], colIndex, visitFn) => {
  for (let y = gridHeight - 2; y > 0; y--) {
    visitFn(y, colIndex, getTreeHeight(grid, gridHeight, y, colIndex));
  }
};

const iterateCol = (grid, [gridHeight], colIndex, visitFn) => {
  const innerHeight = gridHeight - 1;
  for (let y = 1; y < innerHeight; y++) {
    visitFn(y, colIndex, getTreeHeight(grid, gridHeight, y, colIndex));
  }
};

// top,bottom,left,right
const getEdges = (grid, [gridHeight, gridWidth], index) => [
  getTreeHeight(grid, gridHeight, 0, index),
  getTreeHeight(grid, gridHeight, gridHeight - 1, index),
  getTreeHeight(grid, gridHeight, index, 0),
  getTreeHeight(grid, gridHeight, index, gridWidth - 1),
];

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  // console.log();
  const grid = parseInput(input);
  const shape = [lines.length, lines[0].length];
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

  const [innerHeight, innerWidth] = [shape[0] - 1, shape[1] - 1];
  for (let index = 1; index < innerWidth; index++) {
    const [topEdge, bottomEdge, leftEdge, rightEdge] = getEdges(grid, shape, index);
    iterateRow(grid, shape, index, checkIfTreeIsVisible(leftEdge));
    iterateRowReverse(grid, shape, index, checkIfTreeIsVisible(rightEdge));
    iterateCol(grid, shape, index, checkIfTreeIsVisible(topEdge));
    iterateColReverse(grid, shape, index, checkIfTreeIsVisible(bottomEdge));
  }

  return countVisibleEdges(shape[0]) + visibleTrees.size;
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
