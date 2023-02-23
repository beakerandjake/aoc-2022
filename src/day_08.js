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

  // top,bottom,left,right
  const getEdges = (index) => [
    getTree(0, index),
    getTree(treeCount - 1, index),
    getTree(index, 0),
    getTree(index, treeCount - 1),
  ];

  const innerWidth = treeCount - 1;
  for (let index = 1; index < innerWidth; index++) {
    const [topEdge, bottomEdge, leftEdge, rightEdge] = getEdges(index);
    iterateRow(treeCount, index, findVisibleTrees(leftEdge));
    iterateRowReverse(treeCount, index, findVisibleTrees(rightEdge));
    iterateCol(treeCount, index, findVisibleTrees(topEdge));
    iterateColReverse(treeCount, index, findVisibleTrees(bottomEdge));
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
