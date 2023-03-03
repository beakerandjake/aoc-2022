/**
 * Contains solutions for Day 10
 * Puzzle Description: https://adventofcode.com/2022/day/10
 */

const parseLine = (line) =>
  line[0] === 'n'
    ? { name: 'noop', value: 0, cycleCount: 1 }
    : { name: 'addx', value: +line.slice(4), cycleCount: 2 };

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = (() => {
  const applyInstructions = (instructions) => {
    let cycle = 0;
    let register = 1;
    return instructions.map(({ value, cycleCount }) => {
      cycle += cycleCount;
      register += value;
      return { cycle, register };
    });
  };

  const signalCycles = [20, 60, 100, 140, 180, 220];
  const calculateTotalSignalStrength = (cycles) =>
    signalCycles.reduce(
      (total, cycle) =>
        total + cycle * cycles.filter((x) => x.cycle < cycle).reverse()[0].register,
      0
    );

  return ({ lines }) => {
    const instructions = lines.map(parseLine);
    const cycles = applyInstructions(instructions);
    return calculateTotalSignalStrength(cycles);
  };
})();

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
