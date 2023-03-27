/**
 * Contains solutions for Day 11
 * Puzzle Description: https://adventofcode.com/2022/day/11
 */

const parseStartingItems = (line) =>
  line
    .slice(18)
    .split(', ')
    .map((x) => +x);

const parseOperation = (() => {
  const regex = /Operation: new = old ([+*]) (\d+|old)/;
  const add = (lhs, rhs) => lhs + rhs;
  const multiply = (lhs, rhs) => lhs * rhs;
  return (line) => {
    const [, op, rhsRaw] = line.match(regex);
    const fn = op === '+' ? add : multiply;
    const rhs = rhsRaw === 'old' ? -1 : +rhsRaw;
    return { fn, rhs };
  };
})();

const parseTestNumerator = (line) => {
  const regex = / {2}Test: divisible by (\d+)/;
  const [, denominator] = line.match(regex);
  return +denominator;
};

const parseTestResult = (line) => {
  const regex = / {4}If (?:true|false): throw to monkey (\d+)/;
  const [, result] = line.match(regex);
  return +result;
};

const parseMonkey = (lines) => ({
  items: parseStartingItems(lines[0]),
  operation: parseOperation(lines[1]),
  test: {
    numerator: parseTestNumerator(lines[2]),
    trueMonkey: parseTestResult(lines[3]),
    falseMonkey: parseTestResult(lines[4]),
  },
});

const parseLines = (lines) => {
  const toReturn = [];
  const monkeyLineCount = 5;
  for (let index = 1; index < lines.length; index += monkeyLineCount + 2) {
    toReturn.push(parseMonkey(lines.slice(index, index + monkeyLineCount)));
  }
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
  const monkeys = parseLines(lines);
  console.log(monkeys);
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
