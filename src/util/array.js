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
