/**
 * Representation of 2d vectors and points.
 */
export class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x} ${this.y}`;
  }
}

/**
 * Returns true if the two vectors equal.
 * @param {Vector2} lhs
 * @param {Vector2} rhs
 */
export const equals = (lhs, rhs) => lhs.x === rhs.x && lhs.y === rhs.y;

/**
 * Combine the two vectors.
 * @param {Vector2} lhs
 * @param {Vector2} rhs
 */
export const add = (lhs, rhs) => new Vector2(lhs.x + rhs.x, lhs.y + rhs.y);

/**
 * Returns the *squared* distance between the two vectors.
 * @param {Vector2} lhs
 * @param {Vector2} rhs
 */
export const distanceSquared = (lhs, rhs) => (lhs.y - rhs.y) ** 2 + (lhs.x - rhs.x) ** 2;

/**
 * Returns the manhattan or taxicab distance between the two vectors.
 * @param {Vector2} lhs
 * @param {Vector2} rhs
 */
export const taxicabDistance = (lhs, rhs) =>
  Math.abs(lhs.x - rhs.x) + Math.abs(lhs.y - rhs.y);

/**
 * Returns the min and max values of the array.
 * @param {Number[]} values
 */
const bounds = (values) => [Math.min(...values), Math.max(...values)];

/**
 * Finds the top, bottom, left, and right extremes of the positions.
 * The 'zero' is top left, meaning positions increase from top to bottom and left to right.
 * @param {Vector2[]} positions
 */
export const findBounds = (positions) => {
  const [left, right] = bounds(positions.map(({ x }) => x));
  const [top, bottom] = bounds(positions.map(({ y }) => y));
  return { left, right, bottom, top };
};

export const up = new Vector2(0, -1);
export const down = new Vector2(0, 1);
export const left = new Vector2(-1, 0);
export const right = new Vector2(1, 0);
export const downLeft = add(down, left);
export const downRight = add(down, right);
export const upLeft = add(up, left);
export const upRight = add(up, right);
