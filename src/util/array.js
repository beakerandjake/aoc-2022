/**
 * Removes the first element of the array.
 * Does not mutate the original array but instead returns a new copy.
 * @param {Array} arr
 */
export const popHead = (arr) => arr.slice(1);

/**
 * Adds the element to the end of the array.
 * Does not mutate the original array but instead returns a new copy.
 * @param {Array} arr
 * @param {Any} item
 */
export const append = (arr, item) => [...arr, item];

/**
 * Sets the value of the element at the index.
 * Does not mutate the original array but instead returns a new copy.
 * @param {Array} array
 * @param {Number} index
 * @param {Any} value
 */
export const set = (array, index, value) => {
  const copy = [...array];
  copy[index] = value;
  return copy;
};

/**
 * Returns the item in the array with the minimum value.
 * The valueFn is invoked for each element in the array to generate the criterion by which the value is ranked.
 * @param {Array} items
 * @param {Function} valueFn
 */
export const minBy = (items, valueFn) => {
  if (items.length === 0) {
    return null;
  }

  let min = valueFn(items[0]);
  let minIndex = 0;

  items.forEach((item, index) => {
    const currentValue = valueFn(item);
    if (currentValue < min) {
      min = currentValue;
      minIndex = index;
    }
  });

  return { item: items[minIndex], index: minIndex };
};

/**
 * Returns the sum of the numbers in the array.
 * @param {Array} start
 * @param {Number} end
 */
export const sum = (array) => array.reduce((acc, x) => acc + x, 0);

/**
 * Returns the product of the numbers in the array.
 * @param {Array} start
 * @param {Number} end
 */
export const product = (array) => array.reduce((acc, x) => acc * x, 1);

/**
 * Creates a new set from the array.
 * @param {Array} array
 * @param {Function} mapFn - Invoked on each item in the array, allows customization of what gets inserted.
 */
export const toSet = (array, mapFn = (x) => x) => new Set(array.map(mapFn));

/**
 * Returns the min and max values of the array.
 * @param {Number[]} values
 */
export const bounds = (values) => [Math.min(...values), Math.max(...values)];

/**
 * Returns an array of numbers starting at *start*
 * @param {Number} size
 * @param {Number} startAt
 */
export const range = (size, start = 0) =>
  [...Array(size).keys()].map((_, index) => index + start);

/**
 * Returns an iterator function which will return the next item each time it is invoked.
 * Once the last item is reached, the next invocation will return the first item.
 * Expects an immutable array of items whose length does not change.
 * @param {Array} items
 */
export const loopingIterator = (items) => {
  const { length } = items;
  let index = -1;
  return () => {
    if (++index === length) {
      index = 0;
    }
    return items[index];
  };
};
