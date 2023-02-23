/**
 * Contains solutions for Day 8
 * Puzzle Description: https://adventofcode.com/2022/day/8
 */

const parseInput = (input) => input.split('\n').map((line) => [...line].map((x) => +x));

const countEdges = (grid = []) => grid.length * 4 - 4;

const lookLeft = (row, visitFn) => {
  const length = row.length - 1;
  for (let index = 1; index < length; index++) {
    visitFn(index);
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

  const row = grid[1];
  const visibleTrees = [];
  let highest = row[0];

  lookLeft(row, (treeIndex) => {
    const tree = row[treeIndex];
    if (tree > highest) {
      visibleTrees.push(tree);
      highest = tree;
    }
  });

  console.log(`visible trees: ${visibleTrees}`);

  // const nums = [1, 2, 3, 4, 5, 6, 7].map((x) => x.toString());
  // for (let x = 0; x < nums.length; x++) {
  //   for (let y = 0; y < nums.length; y++) {
  //     console.log(`${nums[x]} < ${nums[y]} = ${nums[x] < nums[y]}`);
  //   }
  // }

  return 1234;
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
