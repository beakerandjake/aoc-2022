/**
 * Contains solutions for Day 25
 * Puzzle Description: https://adventofcode.com/2022/day/25
 */
import { sum } from './util/array.js';

const snafuToDecimalMap = {
  2: 2,
  1: 1,
  0: 0,
  '-': -1,
  '=': -2,
};

const remainderToSnafuMap = {
  0: '0',
  1: '1',
  2: '2',
  3: '=',
  4: '-',
};

const toDecimal = (snafu) =>
  [...snafu]
    .reverse()
    .reduce((total, char, index) => total + 5 ** index * snafuToDecimalMap[char], 0);

const toSnafu = (decimal) => {
  let value = decimal;
  const output = [];
  let carry = 0;
  while (value) {
    const remainder = value % 5;
    const modifiedRemainder = carry ? (remainder + 1) % 5 : remainder;
    output.push(remainderToSnafuMap[modifiedRemainder]);
    carry = remainder > 2 || modifiedRemainder > 2 ? 1 : 0;
    value = Math.floor(value / 5);
  }

  if (carry) {
    output.push('1');
  }

  return output.reverse().join('');
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => toSnafu(sum(lines.map(toDecimal)));
/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  // your code here
};
