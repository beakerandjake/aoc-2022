/**
 * Contains solutions for Day 10
 * Puzzle Description: https://adventofcode.com/2022/day/10
 */

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = (() => {
  /**
   * Parse each line of the input.
   * Returns the cycle number the instruction is executed at
   * and the value of the register after the instruction is applied.
   */
  const parseLines = (lines) => {
    let cycle = 0;
    let register = 1;
    return lines.map((line) => {
      const { value, cycleCount } =
        line[0] === 'n'
          ? { value: 0, cycleCount: 1 }
          : { value: +line.slice(4), cycleCount: 2 };
      cycle += cycleCount;
      register += value;
      return { cycle, register };
    });
  };

  /**
   * Returns the value of the register at the given cycle.
   */
  const getRegisterValue = (cycles, cycle) => {
    let found = cycles[0];
    for (let index = 1; index < cycles.length; index++) {
      const current = cycles[index];
      // if we've hit or gone past the cycle we've gone too far.
      // since the register doesn't change during a cycle.
      if (current.cycle >= cycle) {
        break;
      }
      found = current;
    }
    return found.register;
  };

  const calculateTotalSignalStrength = (() => {
    const signalCycles = [20, 60, 100, 140, 180, 220];
    return (cycles) =>
      signalCycles.reduce(
        (total, cycle) => total + cycle * getRegisterValue(cycles, cycle),
        0
      );
  })();

  return ({ lines }) => calculateTotalSignalStrength(parseLines(lines));
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
