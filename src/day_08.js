/**
 * Contains solutions for Day 8
 * Puzzle Description: https://adventofcode.com/2022/day/8
 */

const parseInput = (input) => [...input].filter((x) => x !== '\n');

const getTreeHeight = (grid, rowCount, rowIndex, colIndex) =>
  grid[rowIndex * rowCount + colIndex];

const countVisibleEdges = (height) => height * 4 - 4;

const lookUp = (grid, gridShape, treeY, treeX, treeHeight) => {
  const [gridHeight] = gridShape;
  for (let y = treeY - 1; y >= 0; y--) {
    const siblingHeight = getTreeHeight(grid, gridHeight, y, treeX);
    if (siblingHeight >= treeHeight) {
      return false;
    }
  }
  return true;
};

const lookDown = (grid, gridShape, treeY, treeX, treeHeight) => {
  const [gridHeight] = gridShape;
  for (let y = treeY + 1; y < gridHeight; y++) {
    const siblingHeight = getTreeHeight(grid, gridHeight, y, treeX);
    if (siblingHeight >= treeHeight) {
      return false;
    }
  }
  return true;
};

const lookRight = (grid, gridShape, treeY, treeX, treeHeight) => {
  const [gridHeight, gridWidth] = gridShape;
  for (let x = treeX + 1; x < gridWidth; x++) {
    const siblingHeight = getTreeHeight(grid, gridHeight, treeY, x);
    if (siblingHeight >= treeHeight) {
      return false;
    }
  }
  return true;
};

const lookLeft = (grid, gridShape, treeY, treeX, treeHeight) => {
  const [gridHeight] = gridShape;
  for (let x = treeX - 1; x >= 0; x--) {
    const siblingHeight = getTreeHeight(grid, gridHeight, treeY, x);
    if (siblingHeight >= treeHeight) {
      return false;
    }
  }
  return true;
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
  const shape = [lines.length, lines[0].length];
  let visibleCount = countVisibleEdges(shape[0]);

  const interiorHeight = shape[0] - 1;
  const interiorWidth = shape[1] - 1;
  for (let y = 1; y < interiorHeight; y++) {
    for (let x = 1; x < interiorWidth; x++) {
      const height = getTreeHeight(grid, shape[0], y, x);
      if (
        lookUp(grid, shape, y, x, height) ||
        lookDown(grid, shape, y, x, height) ||
        lookRight(grid, shape, y, x, height) ||
        lookLeft(grid, shape, y, x, height)
      ) {
        visibleCount++;
      }
    }
  }

  return visibleCount;
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
