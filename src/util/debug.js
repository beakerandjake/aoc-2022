import { EOL } from 'node:os';
import { findBounds, toLookup, Vector2 } from './vector2.js';
import { elementAt2d } from './array2d.js';
import { range } from './array.js';

/**
 * Returns a string visualizing the world defined by the points.
 * The size of the world is defined by the extremities of the points.
 * The characters rendered are determined by the charset.
 * @param {Vector2[]} points
 * @param {Object} charset
 */
export const worldToString = (points, charset = { empty: '.', occupied: '#' }) => {
  const pointLookup = toLookup(points);
  const { left, right, top, bottom } = findBounds(points);
  const xRange = range(right - left + 1, left);
  const yRange = range(bottom - top + 1, top);
  return yRange
    .map((y) =>
      xRange
        .map((x) => new Vector2(x, y))
        .map((point) =>
          pointLookup.has(point.toString()) ? charset.occupied : charset.empty
        )
        .join('')
    )
    .join(EOL);
};

/**
 * Returns a string visualizing the flattened 2d array.
 * @param {Array} array - A flat 2d array.
 */
export const array2dToString = (array, shape) => {
  const { width, height } = shape;
  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(elementAt2d(array, shape, y, x));
    }
    rows.push(row);
  }
  return rows.map((row) => row.join('')).join(EOL);
};


