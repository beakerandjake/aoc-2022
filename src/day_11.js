/**
 * Contains solutions for Day 11
 * Puzzle Description: https://adventofcode.com/2022/day/11
 */

const parseLines = (() => {
  const parseStartingItems = (line) =>
    line
      .slice(18)
      .split(', ')
      .map((x) => +x);

  const parseInspectBehavior = (() => {
    const regex = /Operation: new = old ([+*]) (\d+|old)/;
    const add = (lhs, rhs) => lhs + rhs;
    const multiply = (lhs, rhs) => lhs * rhs;
    return (line) => {
      const [, op, rhsRaw] = line.match(regex);
      const fn = op === '+' ? add : multiply;
      const rhs = rhsRaw === 'old' ? null : +rhsRaw;
      return { fn, rhs };
    };
  })();

  const parseNumberFromFirstMatch = (line, regex) => +line.match(regex)[1];

  const parseThrowTestNumerator = (line) =>
    parseNumberFromFirstMatch(line, / {2}Test: divisible by (\d+)/);

  const parseThrowDestination = (line) =>
    parseNumberFromFirstMatch(line, / {4}If (?:true|false): throw to monkey (\d+)/);

  const parseMonkey = (lines) => ({
    startingItems: parseStartingItems(lines[0]),
    inspectBehavior: parseInspectBehavior(lines[1]),
    throwBehavior: {
      numerator: parseThrowTestNumerator(lines[2]),
      trueMonkey: parseThrowDestination(lines[3]),
      falseMonkey: parseThrowDestination(lines[4]),
    },
  });

  return (lines) => {
    const toReturn = [];
    const monkeyLineCount = 5;
    for (let index = 1; index < lines.length; index += monkeyLineCount + 2) {
      toReturn.push(parseMonkey(lines.slice(index, index + monkeyLineCount)));
    }
    return toReturn;
  };
})();

const monkeyInspect = ({ fn, rhs }, item) => fn(item, rhs === null ? item : rhs);

const applyRelief = (worryLevel) => Math.floor(worryLevel / 3);

const monkeyTest = (throwBehavior, worryLevel) =>
  worryLevel % throwBehavior.numerator === 0
    ? throwBehavior.trueMonkey
    : throwBehavior.falseMonkey;

const monkeyInspectAndThrowItem = (monkey, item) => {
  const newWorryLevel = applyRelief(monkeyInspect(monkey.inspectBehavior, item));
  const targetMonkey = monkeyTest(monkey.throwBehavior, newWorryLevel);
  return { item: newWorryLevel, throwToIndex: targetMonkey };
};

const monkeyThrow = (items) => {
  const [, ...toReturn] = items;
  return toReturn;
};

const monkeyCatch = (items, item) => [...items, item];

const throwItemToMonkey = (
  state,
  sourceMonkeyIndex,
  destMonkeyIndex,
  newItemWorryLevel
) => {
  const toReturn = [...state];
  toReturn[sourceMonkeyIndex] = monkeyThrow(toReturn[sourceMonkeyIndex]);
  toReturn[destMonkeyIndex] = monkeyCatch(toReturn[destMonkeyIndex], newItemWorryLevel);
  return toReturn;
};

const monkeyTurn = (monkeys, state, monkeyIndex) =>
  state[monkeyIndex].reduce((prevState, item) => {
    const result = monkeyInspectAndThrowItem(monkeys[monkeyIndex], item);
    const toReturn = throwItemToMonkey(
      prevState,
      monkeyIndex,
      result.throwToIndex,
      result.item
    );
    console.log('step', toReturn);
    return toReturn;
  }, state);

const round = (monkeys, state) =>
  monkeys.reduce((prevState, _, index) => monkeyTurn(monkeys, prevState, index), state);

const rounds = (times, monkeys, state) => {
  [...Array(times)].reduce((prevState) => round(monkeys, prevState), state);
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
  const state = monkeys.map(({ startingItems: items }) => items);
  // monkeyTurn(monkeys, state, 0);
  const result = rounds(20, monkeys, state);
  
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
