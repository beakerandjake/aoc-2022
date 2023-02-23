/**
 * Contains solutions for Day 8
 * Puzzle Description: https://adventofcode.com/2022/day/8
 */

const parseInput = (input) => [...input].filter((x) => x !== '\n');

const getTreeHeight = (grid, rowCount, rowIndex, colIndex) =>
  grid[rowIndex * rowCount + colIndex];

const countVisibleEdges = (height) => height * 4 - 4;

const treeId = (y, x, height) => `[${y},${x}]=${height}`;

// const lookToRight = (grid, gridShape, rowIndex) => {
//   const [gridHeight, gridWidth] = gridShape;
//   const visibleTrees = [];
//   let tallest = getTreeHeight(grid, gridHeight, rowIndex, 0);

//   for (let x = 1; x < gridWidth; x++) {
//     const currentHeight = getTreeHeight(grid, gridHeight, rowIndex, x);

//     if (currentHeight > tallest) {
//       visibleTrees.push(treeId(rowIndex, x, currentHeight));
//       tallest = currentHeight;
//     }
//   }

//   return visibleTrees;
// };

const iterateRow = (grid, gridShape, rowIndex, visitFn) => {
  const [gridHeight, gridWidth] = gridShape;
  const innerWidth = gridWidth - 1;
  for (let x = 1; x < innerWidth; x++) {
    visitFn(rowIndex, x, getTreeHeight(grid, gridHeight, rowIndex, x));
  }
};

const iterateRowReverse = (grid, gridShape, rowIndex, visitFn) => {
  const [gridHeight, gridWidth] = gridShape;
  for (let x = gridWidth - 2; x > 0; x--) {
    visitFn(rowIndex, x, getTreeHeight(grid, gridHeight, rowIndex, x));
  }
};

const iterateColReverse = (grid, gridShape, colIndex, visitFn) => {
  const [gridHeight] = gridShape;
  for (let y = gridHeight - 2; y > 0; y--) {
    visitFn(y, colIndex, getTreeHeight(grid, gridHeight, y, colIndex));
  }
};

const iterateCol = (grid, gridShape, colIndex, visitFn) => {
  const [gridHeight] = gridShape;
  const innerHeight = gridHeight - 1;
  for (let y = 1; y < innerHeight; y++) {
    visitFn(y, colIndex, getTreeHeight(grid, gridHeight, y, colIndex));
  }
};

const getEdges = (grid, [gridHeight, gridWidth], index) => ({
  topEdge: getTreeHeight(grid, gridHeight, 0, index),
  bottomEdge: getTreeHeight(grid, gridHeight, gridHeight - 1, index),
  leftEdge: getTreeHeight(grid, gridHeight, index, 0),
  rightEdge: getTreeHeight(grid, gridHeight, index, gridWidth - 1),
});

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
  const visitFn = (edge) => {
    let tallest = edge;
    return (y, x, height) => {
      if (height > tallest) {
        visibleTrees.add(treeId(y, x, height));
        tallest = height;
      }
    };
  };

  const [innerHeight, innerWidth] = [shape[0] - 1, shape[1] - 1];
  for (let index = 1; index < innerWidth; index++) {
    const { topEdge, bottomEdge, rightEdge, leftEdge } = getEdges(grid, shape, index);
    iterateRow(grid, shape, index, visitFn(leftEdge));
    iterateRowReverse(grid, shape, index, visitFn(rightEdge));
    iterateCol(grid, shape, index, visitFn(topEdge));
    iterateColReverse(grid, shape, index, visitFn(bottomEdge));
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
