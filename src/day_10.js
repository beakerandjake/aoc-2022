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

const inRange = (value, lower, upper) => value >= lower && value <= upper;

const spriteIsVisible = (renderedPixel, spritePosition) =>
  inRange(renderedPixel, spritePosition - 1, spritePosition + 1);

const render = (renderedPixel, spritePosition) =>
  spriteIsVisible(renderedPixel, spritePosition) ? '#' : '.';

const getScreen = (height, width) =>
  [...Array(height)].map(() => [...Array(width)].map(() => '.'));

const parseLines2 = (lines) => {
  let cycle = 0;
  let register = 1;
  const toReturn = lines.map((line) => {
    const { value, cycleCount } =
      line[0] === 'n'
        ? { value: 0, cycleCount: 1 }
        : { value: +line.slice(4), cycleCount: 2 };
    cycle += cycleCount;
    register += value;
    return { cycle, register };
  });
  return [{ cycle: 1, register: 1 }, ...toReturn];
};

const getRegisterValue2 = (cycles, cycle) => {
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

const printScreen = (screen) => {
  console.log(`\n${screen.join('\n')}\n`);
};

const renderRow = (rowOffset, row, cycles) =>
  row
    .map((_, pixelIndex) => {
      const cycleNumber = rowOffset + pixelIndex + 1;
      const registerValue = getRegisterValue2(cycles, cycleNumber);
      return render(pixelIndex, registerValue);
    })
    .join('');

/**
 * Returns the solution for level two of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelTwo = ({ lines }) => {
  const cycles = parseLines2(lines);
  const screen = getScreen(6, 40);
  const result = screen.map((row, rowIndex) => renderRow(rowIndex * 40, row, cycles));
  printScreen(result);
  return 'EKRHEPUZ';
};
