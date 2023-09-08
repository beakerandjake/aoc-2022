import { EOL } from 'node:os';
import { findBounds, toLookup, Vector2 } from './vector2.js';
import { forEach2d } from './array2d.js';
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
 * @param {FlatArray} array - A flat 2d array.
 */
export const array2dToString = (array) => {
  const rows = [...Array(array.shape.height)].map(() => '');
  forEach2d(array, (element, y, x) => {
    rows[y] += element;
  });
  return rows.join(EOL);
};
