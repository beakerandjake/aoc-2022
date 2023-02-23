/**
 * Contains solutions for Day 8
 * Puzzle Description: https://adventofcode.com/2022/day/8
 */

const parseInput = (input) => [...input].filter((x) => x !== '\n');

// const lookLeftStrides = (shape, rowIndex) => ({
//   rowStart: rowIndex,
//   rowEnd: rowIndex + 1,
//   rowStep: 1,
//   colStart: 0,
//   colEnd: shape[1],
//   colReverse: false,
// });

// const lookRightStrides = (shape, rowIndex) => ({
//   rowStart: rowIndex,
//   rowEnd: rowIndex + 1,
//   rowStep: 1,
//   colStart: shape[0],
//   colEnd: shape[1],
//   colReverse: true,
// });

// const iterate = (grid, shape, strides) => {
//   const [height, width] = shape;
//   const { rowStart, rowEnd, rowStep, colStart, colEnd, colReverse } = strides;

//   const colOffset = console.group('Iteration');
//   console.log('shapes', shape);
//   console.log('strides', strides);

//   for (let rowIndex = rowStart; rowIndex < rowEnd; rowIndex++) {
//     for (let colIndex = colStart; colIndex < colEnd; colIndex++) {
//       const tree = grid[rowIndex * height + colIndex];
//       console.log(`grid [${rowIndex},${colIndex}] = ${tree}`);
//     }
//   }

//   console.groupEnd();
// };

const getTree = (grid, shape, rowIndex, colIndex) => grid[rowIndex * shape[0] + colIndex];

const lookLeftStrides = (shape, rowIndex) => ({
  rowStart: rowIndex,
  rowEnd: rowIndex + 1,
  rowReverse: false,
  colStart: 0,
  colEnd: shape[1],
  colReverse: false,
});

const lookRightStrides = (shape, rowIndex) => ({
  rowStart: rowIndex,
  rowEnd: rowIndex + 1,
  rowReverse: false,
  colStart: 0,
  colEnd: shape[1],
  colReverse: true,
});

const indexTranslatorFn = (reverse, length) =>
  reverse ? (index) => length - index - 1 : (index) => index;

const iterate = (shape, strides, visitFn) => {
  // console.group('Iterate');
  const [height, width] = shape;
  const { rowStart, rowEnd, rowReverse, colStart, colEnd, colReverse } = strides;

  const rowIndex = indexTranslatorFn(rowReverse, width);
  const colIndex = indexTranslatorFn(colReverse, height);

  for (let y = rowStart; y < rowEnd; y++) {
    for (let x = colStart; x < colEnd; x++) {
      visitFn(rowIndex(y), colIndex(x));
    }
  }
  console.groupEnd();
};

const lookFromLeft = (shape, rowIndex, visitFn) => {
  const width = shape[1] - 1;
  for (let colIndex = 1; colIndex < width; colIndex++) {
    visitFn(rowIndex, colIndex);
  }
};

const lookFromRight = (shape, rowIndex, visitFn) => {
  const width = shape[1] - 2;
  for (let colIndex = width; colIndex > 0; colIndex--) {
    visitFn(rowIndex, colIndex);
  }
};

const lookFromTop = (shape, colIndex, visitFn) => {
  const height = shape[0] - 1;
  for (let rowIndex = 1; rowIndex < height; rowIndex++) {
    visitFn(rowIndex, colIndex);
  }
};

const lookFromBottom = (shape, colIndex, visitFn) => {
  const height = shape[0] - 2;
  for (let rowIndex = height; rowIndex > 0; rowIndex--) {
    visitFn(rowIndex, colIndex);
  }
};

const findVisible = (grid, shape, iterateFn, index, edgeTree, name) => {
  console.group(`Find Visible ${name}, index: ${index}, edge: ${edgeTree}`);
  const toReturn = [];
  let tallest = edgeTree;

  iterateFn(shape, index, (rowIndex, colIndex) => {
    const tree = getTree(grid, shape, rowIndex, colIndex);
    console.log(
      `visit [${rowIndex}, ${colIndex}] = ${getTree(grid, shape, rowIndex, colIndex)}`
    );
    if (tree > tallest) {
      toReturn.push(tree);
      tallest = tree;
    }
  });
  console.log('visible: ', toReturn);
  console.groupEnd();
  return toReturn;
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  console.log();
  const grid = parseInput(input);
  const shape = [lines.length, lines[0].length];
  const [height, width] = shape;
  const allVisible = [];

  for (let index = 1; index < width - 1; index++) {
    // left
    allVisible.push(
      ...findVisible(
        grid,
        shape,
        lookFromLeft,
        index,
        getTree(grid, shape, index, 0),
        'left'
      )
    );
    // right
    allVisible.push(
      ...findVisible(
        grid,
        shape,
        lookFromRight,
        index,
        getTree(grid, shape, index, shape[1] - 1),
        'right'
      )
    );
    // top
    allVisible.push(
      ...findVisible(
        grid,
        shape,
        lookFromTop,
        index,
        getTree(grid, shape, 0, index),
        'top'
      )
    );
    // bottom
    allVisible.push(
      ...findVisible(
        grid,
        shape,
        lookFromBottom,
        index,
        getTree(grid, shape, shape[0] - 1, index),
        'bottom'
      )
    );
  }

  console.log('all visible', allVisible);
  console.log('all visible length', allVisible.length);

  return grid[0] + shape[1];
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
