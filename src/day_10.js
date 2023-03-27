/**
 * Contains solutions for Day 10
 * Puzzle Description: https://adventofcode.com/2022/day/10
 */

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

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = (() => {
  const signalCycles = [20, 60, 100, 140, 180, 220];

  return ({ lines }) => {
    const cycles = parseLines(lines);
    return signalCycles.reduce(
      (total, cycle) => total + cycle * getRegisterValue(cycles, cycle),
      0
    );
  };
})();

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = (() => {
  const getBlankScreen = (height, width) =>
    [...Array(height)].map(() => [...Array(width)].map(() => '.'));

  const inRange = (value, lower, upper) => value >= lower && value <= upper;

  const renderPixel = (renderedPixel, spritePosition) =>
    inRange(renderedPixel, spritePosition - 1, spritePosition + 1) ? '#' : '.';

  const renderRow = (rowOffset, row, cycles) =>
    row.map((_, pixelIndex) => {
      const cycleNumber = rowOffset + pixelIndex + 1;
      const registerValue = getRegisterValue(cycles, cycleNumber);
      return renderPixel(pixelIndex, registerValue);
    });

  const printScreen = (screen) => {
    console.log(`\n${screen.map((x) => x.join('')).join('\n')}\n`);
  };

  return ({ lines }) => {
    const cycles = [{ cycle: 1, register: 1 }, ...parseLines(lines)];
    const screen = getBlankScreen(6, 40);
    const result = screen.map((row, rowIndex) => renderRow(rowIndex * 40, row, cycles));
    printScreen(result);
    return 'EKRHEPUZ';
  };
})();
