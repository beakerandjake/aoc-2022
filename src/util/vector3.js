import { bounds } from './array.js';

/**
 * Representation of 3d vectors and points.
 */
export class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toString() {
    return `${this.x} ${this.y} ${this.z}`;
  }
}

/**
 * Returns true if the two vectors equal.
 * @param {Vector3} lhs
 * @param {Vector3} rhs
 */
export const equals = (lhs, rhs) => lhs.x === rhs.x && lhs.y === rhs.y && lhs.z === rhs.z;

/**
 * Combine the two vectors.
 * @param {Vector3} lhs
 * @param {Vector3} rhs
 */
export const add = (lhs, rhs) => new Vector3(lhs.x + rhs.x, lhs.y + rhs.y, lhs.z + rhs.z);

/**
 * Finds the top, bottom, left, right, front and back extremes of the positions.
 * "Origin" point is back, left, bottom
 * @param {Vector3[]} positions
 */
export const findBounds = (positions) => {
  const [left, right] = bounds(positions.map(({ x }) => x));
  const [bottom, top] = bounds(positions.map(({ y }) => y));
  const [back, front] = bounds(positions.map(({ z }) => z));
  return {
    left,
    right,
    bottom,
    top,
    back,
    front,
  };
};

/**
 * Returns true if the point is located outside of the bounds.
 * @param {Vector3[]} positions
 * @param {Object} bounds
 */
export const isOutOfBounds = ({ x, y, z }, { left, right, bottom, top, back, front }) =>
  x < left || x > right || y < bottom || y > top || z < back || z > front;

/**
 * Shorthand for writing Vector3(0, 0, -1).
 */
export const back = new Vector3(0, 0, -1);

/**
 * Shorthand for writing Vector3(0, -1, 0).
 */
export const down = new Vector3(0, -1, 0);

/**
 * Shorthand for writing Vector3(0, 0, 1).
 */
export const forward = new Vector3(0, 0, 1);

/**
 * Shorthand for writing Vector3(-1, 0, 0).
 */
export const left = new Vector3(-1, 0, 0);

/**
 * Shorthand for writing Vector3(1, 1, 1).
 */
export const one = new Vector3(1, 1, 1);

/**
 * Shorthand for writing Vector3(1, 0, 0).
 */
export const right = new Vector3(1, 0, 0);

/**
 * Shorthand for writing Vector3(0, 1, 0).
 */
export const up = new Vector3(0, 1, 0);

/**
 * Shorthand for writing Vector3(0, 0, 0).
 */
export const zero = new Vector3(0, 0, 0);
