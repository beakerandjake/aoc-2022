/**
 * Contains solutions for Day 20
 * Puzzle Description: https://adventofcode.com/2022/day/20
 */
import { toNumber } from './util/string.js';

const parseInput = (lines) => lines.map(toNumber);

const wrapIndex = (index, length) => (index + length) % length;

const move = (array, index, times, direction) => {
  const toReturn = [...array];
  let remaining = times;
  let a = index;
  let b = wrapIndex(index + direction, toReturn.length);
  while (remaining--) {
    const temp = toReturn[a];
    toReturn[a] = toReturn[b];
    toReturn[b] = temp;
    a = b;
    b = wrapIndex(b + direction, toReturn.length);
  }
  return toReturn;
};

const moveRight = (array, index, times) => move(array, index, times, 1);

const moveLeft = (array, index, times) => move(array, index, times, -1);

const mix = (encrypted, mixed) => {
  let toReturn = [...mixed];

  for (let index = 0; index < encrypted.length; index++) {
    const number = encrypted[index];
    const mixedIndex = toReturn.indexOf(index);
    const numberOfMoves = Math.abs(number) % (toReturn.length - 1);

    if (number === 0 || numberOfMoves === 0) {
      continue;
    }

    toReturn =
      number > 0
        ? moveRight(toReturn, mixedIndex, numberOfMoves)
        : moveLeft(toReturn, mixedIndex, numberOfMoves);
  }

  return toReturn;
};

const groveCoordinate = (encrypted, mixed) => {
  const zeroIndex = mixed.indexOf(encrypted.indexOf(0));
  const a = encrypted[mixed[(zeroIndex + 1000) % mixed.length]];
  const b = encrypted[mixed[(zeroIndex + 2000) % mixed.length]];
  const c = encrypted[mixed[(zeroIndex + 3000) % mixed.length]];
  return a + b + c;
};

/**
 * Returns the solution for level one of this puzzle.
 */
export const levelOne = ({ lines }) => {
  const encrypted = parseInput(lines);
  const mixed = encrypted.map((_, i) => i);
  const result = mix(encrypted, mixed);
  return groveCoordinate(encrypted, result);
};

/**
 * Returns the solution for level two of this puzzle.
 */
export const levelTwo = ({ input, lines }) => {
  const encrypted = parseInput(lines).map((x) => x * 811589153);
  let mixed = encrypted.map((_, i) => i);
  let mixCount = 10;
  while (mixCount--) {
    mixed = mix(encrypted, mixed);
  }
  return groveCoordinate(encrypted, mixed);
};
