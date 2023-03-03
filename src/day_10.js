/**
 * Contains solutions for Day 10
 * Puzzle Description: https://adventofcode.com/2022/day/10
 */

const parseLine = (line) =>
  line[0] === 'n'
    ? { name: 'noop', value: 0, cycleCount: 1 }
    : { name: 'addx', value: +line.slice(4), cycleCount: 2 };

const applyInstructions = (instructions) => {
  let cycle = 0;
  let register = 1;
  return instructions.map(({ value, cycleCount }) => {
    cycle += cycleCount;
    register += value;
    return { cycle, register };
  });
};

const filterCycles = (cycles, maxCycle) => cycles.filter((x) => x.cycle < maxCycle);

const getRegisterValue = (cycles) => cycles[cycles.length - 1].register;

const calculateTotalSignalStrength = (cycles) => {
  const signalCycles = [20, 60, 100, 140, 180, 220];
  const registerValues = signalCycles.map(
    (cycle) => cycle * getRegisterValue(filterCycles(cycles, cycle))
  );
  return registerValues.reduce((total, x) => total + x, 0);
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ lines }) => {
  const instructions = lines.map(parseLine);
  const cycles = applyInstructions(instructions);
  return calculateTotalSignalStrength(cycles);
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
