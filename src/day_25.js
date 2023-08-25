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
    let quantity = quantities[index] || 0;
    if (borrow && quantity < 3) {
      quantity += 1;
    }
    output.push(decimalToSnafuChars[quantity]);
    borrow = quantity > 2 ? 1 : 0;
  }
  if (borrow) {
    output.push('1');
  }
  return output.reverse().join('');
};

/**
 * Returns the solution for level one of this puzzle.
 * @param {Object} args - Provides both raw and split input.
 * @param {String} args.input - The original, unparsed input string.
 * @param {String[]} args.lines - Array containing each line of the input string.
 * @returns {Number|String}
 */
export const levelOne = ({ input, lines }) => {
  // console.log(4890);
  // console.log(snafuToDecimal)'1-11-2'));
  const decimals = [1747, 906, 198, 11, 201, 31, 1257, 32, 353, 107, 7, 3, 37];
  const snafus = [
    '1=-0-2',
    '12111',
    '2=0=',
    '21',
    '2=01',
    '111',
    '20012',
    '112',
    '1=-1=',
    '1-12',
    '12',
    '1=',
    '122',
  ];

  // console.log('decimal to snafu', arraysEqual(decimals, snafus.map(snafuToDecimal)));
  // console.log(
  //   'snafu to decimal',
  //   arraysEqual(decimals.map(decimalToSnafu), snafuToDecimal)
  // );

  // console.log(arrayToString(decimals.map(decimalToSnafu)));
  
  console.log(decimalToSnafu(1747));
  //
  // const decimals = lines.map(snafuToDecimal);
  // return decimalToSnafu(sum(decimals));
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
