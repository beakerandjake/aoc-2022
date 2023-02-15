/**
 * Contains solutions for Day 5
 * Puzzle Description: https://adventofcode.com/2022/day/5
 */

const parseStacks = (initialStacks) => {
  const lines = initialStacks.split('\n');
  const stacks = new Array((lines[0].length + 1) / 4).fill(0).map(() => []);
  // ignore the last line it's useless for parsing.
  for (let lineIndex = lines.length - 1; lineIndex--; ) {
    const line = lines[lineIndex];
    // a crate is 3 chars and each crate is separated by a blank space.
    for (let charIndex = 0; charIndex < line.length; charIndex += 4) {
      const crate = line.slice(charIndex, charIndex + 3);
      // ignore empty crates.
      if (crate !== '   ') {
        stacks[charIndex / 4].push(crate);
      }
    }
  }
  return stacks;
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input }) => {
  const [initialStacks, directions] = input.split('\n\n');
  const stacks = parseStacks(initialStacks);

  return 123;
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
