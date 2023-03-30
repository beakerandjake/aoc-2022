/**
 * Contains solutions for Day 5
 * Puzzle Description: https://adventofcode.com/2022/day/5
 */

/**
 * Prints stacks with the same format as the input
 * @param {String} stacks
 */
const printStacks = (stacks) => {
  const maxStackLength = Math.max(...stacks.map((x) => x.length));
  for (let index = maxStackLength; index--; ) {
    const crates = stacks.map((stack) => stack[index] || ' ');
    console.log(crates.join(' '));
  }
  console.log(stacks.map((_, index) => `${index + 1}`).join(' '));
};

/**
 * Parses the initial stack configuration from the input
 * and returns a 2d array representing the stacks.
 * @param {String} initialStacks
 * @returns {Array.<String[]>}
 */
const parseStacks = (initialStacks) => {
  const lines = initialStacks.split('\n');
  const stacks = new Array((lines[0].length + 1) / 4).fill(0).map(() => []);
  // ignore the last line it's useless for parsing.
  for (let lineIndex = lines.length - 1; lineIndex--; ) {
    const line = lines[lineIndex];
    // a crate is 3 chars and each crate is separated by a blank space.
    for (let charIndex = 0; charIndex < line.length; charIndex += 4) {
      const crate = line[charIndex + 1];
      // ignore empty crates.
      if (crate !== ' ') {
        stacks[charIndex / 4].push(crate);
      }
    }
  }
  return stacks;
};

/**
 * Regex which parses the count, source stack index and dest stack index from the input step.
 */
const stepRegex = /move (\d+) from (\d+) to (\d+)/;

/**
 * Parses the step from the input.
 * @param {String} input
 */
const parseStep = (input) => {
  const matches = input.match(stepRegex);
  return {
    // convert source and dest to a zero based index.
    source: +matches[2] - 1,
    dest: +matches[3] - 1,
    count: +matches[1],
  };
};

/**
 * Parses the puzzle input, gets the initial stack configuration and the steps.
 * @param {String} input
 */
const parseInput = (input) => {
  const split = input.trimEnd().split('\n\n');
  return {
    stacks: parseStacks(split[0]),
    steps: split[1].split('\n').map(parseStep),
  };
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input }) => {
  const { stacks, steps } = parseInput(input);
  steps.forEach(({ source, dest, count }) => {
    stacks[dest].push(...stacks[source].splice(-count).reverse());
  });
  return stacks.map((x) => x[x.length - 1]).join('');
};

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ input }) => {
  const { stacks, steps } = parseInput(input);
  steps.forEach(({ source, dest, count }) => {
    stacks[dest].push(...stacks[source].splice(-count));
  });
  return stacks.map((x) => x[x.length - 1]).join('');
};
