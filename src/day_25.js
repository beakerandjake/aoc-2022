/**
 * Contains solutions for Day 25
 * Puzzle Description: https://adventofcode.com/2022/day/25
 */
import { arraysEqual, sum, arrayToString } from './util/array.js';

const snafuToDecimalChars = {
  2: 2,
  1: 1,
  0: 0,
  '-': -1,
  '=': -2,
};

const decimalToSnafuChars = {
  0: '0',
  1: '1',
  2: '2',
  3: '=',
  4: '-',
};

const snafuToDecimal = (snafu) =>
  [...snafu]
    .reverse()
    .reduce((total, char, index) => total + 5 ** index * snafuToDecimalChars[char], 0);

const decimalToSnafu = (decimal) => {
  let value = decimal;
  const quantities = [];
  while (value) {
    quantities.push(value % 5);
    value = Math.floor(value / 5);
  }

  let borrow = 0;
  const output = [];
  for (let index = 0; index < quantities.length; index++) {
    const originalQuantity = quantities[index] || 0;
    const modifiedQuantity = borrow ? (originalQuantity + 1) % 5 : originalQuantity;
    output.push(decimalToSnafuChars[modifiedQuantity]);
    borrow = originalQuantity > 2 || modifiedQuantity > 2 ? 1 : 0;
  }
  if (borrow) {
    output.push('1');
  }
  return output.reverse().join('');
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => decimalToSnafu(sum(lines.map(snafuToDecimal)));
/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
